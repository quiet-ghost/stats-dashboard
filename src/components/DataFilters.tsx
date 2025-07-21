import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import type { EmployeePerformance } from "@/types";

interface DataFiltersProps {
  data: EmployeePerformance[];
  onFilterChange: (filteredData: EmployeePerformance[]) => void;
}

interface FilterState {
  globalSearch: string;
  employee: string;
  efficiency: string;
  weeks: string;
  minPickTime: string;
  maxPickTime: string;
  minBins: string;
  maxBins: string;
  minTimePerBin: string;
  maxTimePerBin: string;
}

export function DataFilters({ data, onFilterChange }: DataFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    globalSearch: "",
    employee: "",
    efficiency: "",
    weeks: "",
    minPickTime: "",
    maxPickTime: "",
    minBins: "",
    maxBins: "",
    minTimePerBin: "",
    maxTimePerBin: "",
  });

  const applyFilters = (newFilters: FilterState) => {
    let filtered = [...data];
    if (newFilters.globalSearch) {
      const searchTerm = newFilters.globalSearch.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.employee.toLowerCase().includes(searchTerm) ||
          emp.weeks.some((week) => week.includes(searchTerm)),
      );
    }
    if (newFilters.employee) {
      const employeeSearch = newFilters.employee.toLowerCase();
      filtered = filtered.filter((emp) =>
        emp.employee.toLowerCase().includes(employeeSearch),
      );
    }
    if (newFilters.efficiency) {
      filtered = filtered.filter(
        (emp) => emp.efficiency === newFilters.efficiency,
      );
    }
    if (newFilters.weeks) {
      const weekSearch = newFilters.weeks.toLowerCase();
      filtered = filtered.filter((emp) =>
        emp.weeks.some((week) => week.toLowerCase().includes(weekSearch)),
      );
    }
    if (newFilters.minPickTime) {
      const min = parseFloat(newFilters.minPickTime);
      filtered = filtered.filter((emp) => emp.totalPickTime >= min);
    }
    if (newFilters.maxPickTime) {
      const max = parseFloat(newFilters.maxPickTime);
      filtered = filtered.filter((emp) => emp.totalPickTime <= max);
    }

    if (newFilters.minBins) {
      const min = parseInt(newFilters.minBins);
      filtered = filtered.filter((emp) => emp.totalBins >= min);
    }
    if (newFilters.maxBins) {
      const max = parseInt(newFilters.maxBins);
      filtered = filtered.filter((emp) => emp.totalBins <= max);
    }

    if (newFilters.minTimePerBin) {
      const min = parseFloat(newFilters.minTimePerBin) / 60; // Convert minutes to hours
      filtered = filtered.filter((emp) => emp.avgTimePerBin >= min);
    }
    if (newFilters.maxTimePerBin) {
      const max = parseFloat(newFilters.maxTimePerBin) / 60; // Convert minutes to hours
      filtered = filtered.filter((emp) => emp.avgTimePerBin <= max);
    }

    onFilterChange(filtered);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      globalSearch: "",
      employee: "",
      efficiency: "",
      weeks: "",
      minPickTime: "",
      maxPickTime: "",
      minBins: "",
      maxBins: "",
      minTimePerBin: "",
      maxTimePerBin: "",
    };
    setFilters(clearedFilters);
    applyFilters(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Data Filters
            {hasActiveFilters && (
              <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                Active
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Global Search - Always Visible */}
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees, initials, weeks... (e.g., 'ALU', '17', 'high')"
            value={filters.globalSearch}
            onChange={(e) => handleFilterChange("globalSearch", e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Employee Name Filter */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Employee Name/Initials
              </label>
              <Input
                placeholder="e.g., ALU, John, etc."
                value={filters.employee}
                onChange={(e) => handleFilterChange("employee", e.target.value)}
              />
            </div>

            {/* Efficiency Filter */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Efficiency Level
              </label>
              <select
                className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                value={filters.efficiency}
                onChange={(e) =>
                  handleFilterChange("efficiency", e.target.value)
                }
              >
                <option value="">All Levels</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Weeks Filter */}
            <div>
              <label className="text-sm font-medium mb-1 block">Weeks</label>
              <Input
                placeholder="e.g., 17, 18, 19"
                value={filters.weeks}
                onChange={(e) => handleFilterChange("weeks", e.target.value)}
              />
            </div>

            {/* Pick Time Range */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Pick Time Range (hours)
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  step="0.1"
                  value={filters.minPickTime}
                  onChange={(e) =>
                    handleFilterChange("minPickTime", e.target.value)
                  }
                />
                <Input
                  placeholder="Max"
                  type="number"
                  step="0.1"
                  value={filters.maxPickTime}
                  onChange={(e) =>
                    handleFilterChange("maxPickTime", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Bins Range */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Total Bins Range
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={filters.minBins}
                  onChange={(e) =>
                    handleFilterChange("minBins", e.target.value)
                  }
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={filters.maxBins}
                  onChange={(e) =>
                    handleFilterChange("maxBins", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Time per Bin Range */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Time per Bin Range (minutes)
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  step="0.01"
                  value={filters.minTimePerBin}
                  onChange={(e) =>
                    handleFilterChange("minTimePerBin", e.target.value)
                  }
                />
                <Input
                  placeholder="Max"
                  type="number"
                  step="0.01"
                  value={filters.maxTimePerBin}
                  onChange={(e) =>
                    handleFilterChange("maxTimePerBin", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className="text-sm text-muted-foreground">
            Showing {data.length} employees after filtering
          </div>
        )}
      </CardContent>
    </Card>
  );
}
