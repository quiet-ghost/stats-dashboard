import * as XLSX from "xlsx";
import type { StatsData, PickStatsData, PackStatsData } from "@/types";

export function processExcelFile(file: File): Promise<StatsData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const processedData = processSheetData(jsonData as any[][], file.name);

        resolve(processedData);
      } catch (error) {
        reject(new Error(`Failed to process Excel file: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsArrayBuffer(file);
  });
}

function processSheetData(data: any[][], fileName: string): StatsData[] {
  if (data.length < 3) return [];
  const weekMatch = fileName.match(/(\d+)\.xlsx?$/);
  const week = weekMatch ? weekMatch[1] : undefined;
  const isPickData = fileName.toLowerCase().includes("pick");
  const isPackData = fileName.toLowerCase().includes("pack");

  if (!isPickData && !isPackData) {
    console.warn("Could not determine file type for:", fileName);
    return [];
  }

  const headers = data[1];

  if (isPickData) {
    return processPickData(data, headers, fileName, week);
  } else {
    return processPackData(data, headers, fileName, week);
  }
}

function processPickData(
  data: any[][],
  _headers: any[],
  fileName: string,
  week?: string,
): PickStatsData[] {
  const processedData: PickStatsData[] = [];

  for (let i = 2; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0 || !row[0]) continue;

    const employee = String(row[0]).trim();
    if (!employee || employee === "TOTALS") continue;

    const pickData: PickStatsData = {
      id: `${fileName}-${employee}-${i}`,
      fileName,
      week,
      employee,
      totalPicks: Number(row[1]) || 0,
      avgPickTime: Number(row[2]) || 0,
      totalItemsPicked: Number(row[3]) || 0,
      totalBins: Number(row[4]) || 0,
      avgTimePerBin: Number(row[5]) || 0,
      avgBinsPerPick: Number(row[6]) || 0,
      totalOrders: Number(row[7]) || 0,
      avgOrdersPerPick: Number(row[8]) || 0,
      totalPickTime: Number(row[9]) * 24 || 0,
      itemsPerHour: Number(row[10]) || 0,
      binsPerHour: Number(row[11]) || 0,
      avgItemsPerBin: Number(row[12]) || 0,
      type: "pick",
    };

    processedData.push(pickData);
  }

  return processedData;
}

function processPackData(
  data: any[][],
  _headers: any[],
  fileName: string,
  week?: string,
): PackStatsData[] {
  const processedData: PackStatsData[] = [];

  for (let i = 2; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0 || !row[1]) continue;

    const employee = String(row[1]).trim();
    if (!employee || employee === "TOTALS") continue;

    const packData: PackStatsData = {
      id: `${fileName}-${employee}-${i}`,
      fileName,
      week,
      employee,
      ordersPerHour: Number(row[0]) || 0,
      totalPacks: Number(row[2]) || 0,
      totalItems: Number(row[3]) || 0,
      totalTime: Number(row[4]) * 24 || 0,
      avgPackTime: Number(row[5]) || 0,
      avgItemsPerPack: Number(row[6]) || 0,
      type: "pack",
    };

    processedData.push(packData);
  }

  return processedData;
}

export function combineDataFromFiles(
  files: { data: StatsData[] }[],
): StatsData[] {
  return files.flatMap((file) => file.data || []);
}

export function calculateEmployeePerformance(
  data: StatsData[],
): import("@/types").EmployeePerformance[] {
  const employeeMap = new Map<
    string,
    {
      totalPickTime: number;
      totalBins: number;
      totalPacks: number;
      totalPackTime: number;
      weeks: Set<string>;
    }
  >();

  data.forEach((record) => {
    if (!employeeMap.has(record.employee)) {
      employeeMap.set(record.employee, {
        totalPickTime: 0,
        totalBins: 0,
        totalPacks: 0,
        totalPackTime: 0,
        weeks: new Set(),
      });
    }

    const employee = employeeMap.get(record.employee)!;

    if (record.week) {
      employee.weeks.add(record.week);
    }

    if (record.type === "pick") {
      employee.totalPickTime += record.totalPickTime;
      employee.totalBins += record.totalBins;
    } else if (record.type === "pack") {
      employee.totalPacks += record.totalPacks;
      employee.totalPackTime += record.totalTime;
    }
  });

  const performances: import("@/types").EmployeePerformance[] = [];

  employeeMap.forEach((stats, employeeName) => {
    const avgTimePerBinSeconds =
      stats.totalBins > 0 ? (stats.totalPickTime * 3600) / stats.totalBins : 0;

    // Thresholds: ≤25s = Level 3, 26-35s = Level 2, >35s = Level 1
    let efficiency: "level1" | "level2" | "level3" = "level2";
    if (avgTimePerBinSeconds > 0) {
      if (avgTimePerBinSeconds <= 25.5) {
        efficiency = "level3";
      } else if (avgTimePerBinSeconds > 35) {
        efficiency = "level1";
      }
    }

    performances.push({
      employee: employeeName,
      totalPickTime: stats.totalPickTime,
      totalBins: stats.totalBins,
      avgTimePerBin: avgTimePerBinSeconds,
      totalPacks: stats.totalPacks > 0 ? stats.totalPacks : undefined,
      totalPackTime: stats.totalPackTime > 0 ? stats.totalPackTime : undefined,
      weeks: Array.from(stats.weeks).sort(),
      efficiency,
    });
  });

  return performances.sort((a, b) => {
    const efficiencyOrder = { level3: 3, level2: 2, level1: 1 };
    const effDiff =
      efficiencyOrder[b.efficiency] - efficiencyOrder[a.efficiency];
    if (effDiff !== 0) return effDiff;
    return b.totalBins - a.totalBins;
  });
}

export function getWeeklyTrends(data: StatsData[]): {
  week: string;
  totalPickTime: number;
  totalBins: number;
  avgTimePerBin: number;
  employeeCount: number;
}[] {
  const weeklyMap = new Map<
    string,
    {
      totalPickTime: number;
      totalBins: number;
      employees: Set<string>;
    }
  >();

  data.forEach((record) => {
    if (!record.week || record.type !== "pick") return;

    if (!weeklyMap.has(record.week)) {
      weeklyMap.set(record.week, {
        totalPickTime: 0,
        totalBins: 0,
        employees: new Set(),
      });
    }

    const week = weeklyMap.get(record.week)!;
    week.totalPickTime += record.totalPickTime;
    week.totalBins += record.totalBins;
    week.employees.add(record.employee);
  });

  return Array.from(weeklyMap.entries())
    .map(([week, stats]) => ({
      week,
      totalPickTime: stats.totalPickTime,
      totalBins: stats.totalBins,
      avgTimePerBin:
        stats.totalBins > 0
          ? (stats.totalPickTime * 3600) / stats.totalBins
          : 0,
      employeeCount: stats.employees.size,
    }))
    .sort((a, b) => parseInt(a.week) - parseInt(b.week));
}

export function getUniqueValues(
  data: StatsData[],
  field: keyof StatsData,
): string[] {
  const values = data
    .map((item) => item[field])
    .filter((value): value is string => value !== undefined && value !== null)
    .map((value) => String(value));

  return Array.from(new Set(values)).sort();
}
