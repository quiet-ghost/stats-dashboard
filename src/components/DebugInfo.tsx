import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EmployeePerformance } from '@/types';

interface DebugInfoProps {
  data: EmployeePerformance[];
}

export function DebugInfo({ data }: DebugInfoProps) {
  if (data.length === 0) return null;

  // Calculate overall totals
  const totalPickTime = data.reduce((sum, emp) => sum + emp.totalPickTime, 0);
  const totalBins = data.reduce((sum, emp) => sum + emp.totalBins, 0);
  const calculatedAvgTimePerBinSeconds = totalBins > 0 ? (totalPickTime * 3600) / totalBins : 0;

  // Show top 3 employees for verification
  const topEmployees = data.slice(0, 3);

  return (
    <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
      <CardHeader>
        <CardTitle className="text-sm">🔍 Calculation Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>Overall Totals:</strong>
          <div>Total Pick Time: {totalPickTime.toFixed(4)} hours</div>
          <div>Total Bins: {totalBins.toLocaleString()}</div>
          <div>Calculated Avg Time per Bin: {calculatedAvgTimePerBinSeconds.toFixed(1)} seconds</div>
        </div>
        
        <div>
          <strong>Top 3 Employees (Verification):</strong>
          {topEmployees.map(emp => (
            <div key={emp.employee} className="ml-2">
              <strong>{emp.employee}:</strong> {emp.totalPickTime.toFixed(4)}h ÷ {emp.totalBins} bins = {emp.avgTimePerBin.toFixed(1)}s/bin
            </div>
          ))}
        </div>
        
        <div className="text-muted-foreground">
          Formula: (Total Pick Time × 3600) ÷ Total Bins = Avg Time per Bin (seconds)
          <br />
          Efficiency: ≤25s = High, 26-45s = Medium, {'>'} 45s = Low
        </div>
      </CardContent>
    </Card>
  );
}