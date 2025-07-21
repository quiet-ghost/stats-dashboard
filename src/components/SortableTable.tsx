import { useState } from "react";
import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import type { EmployeePerformance } from "@/types";

interface SortableTableProps {
  data: EmployeePerformance[];
  efficiencyColors: Record<string, string>;
}

type SortField = keyof EmployeePerformance | "none";
type SortDirection = "asc" | "desc";

export function SortableTable({ data, efficiencyColors }: SortableTableProps) {
  const [sortField, setSortField] = useState<SortField>("none");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortField === "none") return 0;

    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === "weeks") {
      aValue = a.weeks.join(", ");
      bValue = b.weeks.join(", ");
    } else if (sortField === "efficiency") {
      const efficiencyOrder = { level3: 3, level2: 2, level1: 1 };
      aValue = efficiencyOrder[a.efficiency];
      bValue = efficiencyOrder[b.efficiency];
    }
    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === "asc" ? comparison : -comparison;
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 text-primary" />
    ) : (
      <ChevronDown className="h-4 w-4 text-primary" />
    );
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <th
      className="text-center p-2 cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center justify-center gap-1">
        {children}
        <SortIcon field={field} />
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-center">
        <thead>
          <tr className="border-b">
            <SortableHeader field="employee">Employee</SortableHeader>
            <SortableHeader field="totalPickTime">
              Total Pick Time
            </SortableHeader>
            <SortableHeader field="totalBins">
              Total Bins
            </SortableHeader>
            <SortableHeader field="avgTimePerBin">
              Avg Time per Bin
            </SortableHeader>
            <SortableHeader field="efficiency">
              Efficiency
            </SortableHeader>
            <SortableHeader field="weeks">
              Weeks
            </SortableHeader>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((emp) => (
            <tr key={emp.employee} className="border-b hover:bg-muted/50">
              <td className="p-2 font-medium">{emp.employee}</td>
              <td className="p-2 text-center">
                {emp.totalPickTime.toFixed(2)} hrs
              </td>
              <td className="p-2 text-center">
                {emp.totalBins.toLocaleString()}
              </td>
              <td className="p-2 text-center font-bold">
                {Number(emp.avgTimePerBin).toFixed(0)}s
              </td>
              <td className="p-2 text-center">
                <span
                  className="px-2 py-1 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: efficiencyColors[emp.efficiency] }}
                >
                  Level {emp.efficiency.slice(-1).toUpperCase()}
                </span>
              </td>
              <td className="p-2 text-center text-xs">
                {emp.weeks.join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sortedData.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No employees match the current filters
        </div>
      )}

      {sortField !== "none" && (
        <div className="text-xs text-muted-foreground mt-2 px-2">
          Sorted by {sortField} (
          {sortDirection === "asc" ? "ascending" : "descending"})
        </div>
      )}
    </div>
  );
}
