export interface ChartData {
  labels: string[];
  values: number[];
}

export interface DashboardMetrics {
  totalUsers: number;
  totalAccess: number;
  conversionRate: number;
}

export interface RecentUser {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  accessLevel: string;
  lastAccess: string;
}

export interface DashboardData extends DashboardMetrics {
  performanceChart: ChartData;
  recentUsers: RecentUser[];
}

export interface DashboardFilters {
  period: 'day' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
} 