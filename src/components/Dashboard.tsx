import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataFilters } from "@/components/DataFilters";
import { SortableTable } from "@/components/SortableTable";

import type { StatsData, EmployeePerformance } from "@/types";
import { calculateEmployeePerformance } from "@/utils/excelProcessor";

interface DashboardProps {
  data: StatsData[];
}

const EFFICIENCY_COLORS = {
  level3: "#22c55e", // Green
  level2: "#f59e0b", // Amber
  level1: "#ef4444", // Red
};

export function Dashboard({ data }: DashboardProps) {
  const [filteredEmployeeData, setFilteredEmployeeData] = useState<
    EmployeePerformance[]
  >([]);

  if (data.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Upload Excel files to see analytics
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allEmployeePerformance = calculateEmployeePerformance(data);

  const employeePerformance =
    filteredEmployeeData.length > 0
      ? filteredEmployeeData
      : allEmployeePerformance;
  const totalPickTime = employeePerformance.reduce(
    (sum, emp) => sum + emp.totalPickTime,
    0,
  );
  const totalBins = employeePerformance.reduce(
    (sum, emp) => sum + emp.totalBins,
    0,
  );
  const avgTimePerBinSeconds =
    totalBins > 0 ? (totalPickTime * 3600) / totalBins : 0; // Convert to seconds
  const uniqueEmployees = employeePerformance.length;


  const handleFilterChange = (filtered: EmployeePerformance[]) => {
    setFilteredEmployeeData(filtered);
  };

  return (
    <div className="space-y-6">
      {/* Data Filters */}
      <DataFilters
        data={allEmployeePerformance}
        onFilterChange={handleFilterChange}
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pick Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPickTime.toFixed(1)} hrs
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredEmployeeData.length > 0
                ? "Filtered data"
                : "All employees"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBins.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Bins processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Time per Bin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgTimePerBinSeconds.toFixed(0)}s
            </div>
            <p className="text-xs text-muted-foreground">
              {avgTimePerBinSeconds <= 25.5
                ? "Level 3 efficiency (≤25s)"
                : avgTimePerBinSeconds <= 35
                  ? "Level 2 efficiency (26-35s)"
                  : "Level 1 efficiency (>35s)"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uniqueEmployees}
              {filteredEmployeeData.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  /{allEmployeePerformance.length}
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-1">
              <span
                className="text-xs px-2 py-1 rounded"
                style={{
                  backgroundColor: EFFICIENCY_COLORS.level3,
                  color: "white",
                }}
              >
                {
                  employeePerformance.filter((e) => e.efficiency === "level3")
                    .length
                }{" "}
                Level 3
              </span>
              <span
                className="text-xs px-2 py-1 rounded"
                style={{
                  backgroundColor: EFFICIENCY_COLORS.level2,
                  color: "white",
                }}
              >
                {
                  employeePerformance.filter((e) => e.efficiency === "level2")
                    .length
                }{" "}
                Level 2
              </span>
              <span
                className="text-xs px-2 py-1 rounded"
                style={{
                  backgroundColor: EFFICIENCY_COLORS.level1,
                  color: "white",
                }}
              >
                {
                  employeePerformance.filter((e) => e.efficiency === "level1")
                    .length
                }{" "}
                Level 1
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Performance Table with Sorting */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Performance Summary</CardTitle>
          <p className="text-sm text-muted-foreground">
            Pivot table view with aggregated data across all uploaded weeks.
            Click column headers to sort. Use filters above to search by
            initials, efficiency, weeks, or ranges.
          </p>
        </CardHeader>
        <CardContent>
          <SortableTable
            data={employeePerformance}
            efficiencyColors={EFFICIENCY_COLORS}
          />
        </CardContent>
      </Card>





      {/* Filter Status */}
      {filteredEmployeeData.length > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              📊 <strong>Filtered View:</strong> Showing{" "}
              {filteredEmployeeData.length} of {allEmployeePerformance.length}{" "}
              employees. Summary cards and employee chart reflect filtered data.
              Weekly trends show all data for context.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
