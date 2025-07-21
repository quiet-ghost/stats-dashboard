export interface PickStatsData {
  id: string;
  fileName: string;
  week?: string;
  employee: string;
  totalPicks: number;
  avgPickTime: number;
  totalItemsPicked: number;
  totalBins: number;
  avgTimePerBin: number;
  avgBinsPerPick: number;
  totalOrders: number;
  avgOrdersPerPick: number;
  totalPickTime: number;
  itemsPerHour: number;
  binsPerHour: number;
  avgItemsPerBin: number;
  type: 'pick';
}

export interface PackStatsData {
  id: string;
  fileName: string;
  week?: string;
  employee: string;
  totalPacks: number;
  totalItems: number;
  totalTime: number;
  avgPackTime: number;
  avgItemsPerPack: number;
  ordersPerHour: number;
  type: 'pack';
}

export type StatsData = PickStatsData | PackStatsData;

export interface EmployeePerformance {
  employee: string;
  totalPickTime: number;
  totalBins: number;
  avgTimePerBin: number;
  totalPacks?: number;
  totalPackTime?: number;
  weeks: string[];
  efficiency: 'level1' | 'level2' | 'level3';
}

export interface FileUpload {
  file: File;
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  data?: StatsData[];
  error?: string;
}