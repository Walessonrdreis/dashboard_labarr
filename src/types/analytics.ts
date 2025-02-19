export interface PageView {
  page: string;
  views: number;
  uniqueVisitors: number;
  averageTime: string;
  bounceRate: number;
}

export interface VisitMetrics {
  totalVisits: number;
  uniqueVisitors: number;
  averageTimeOnSite: string;
  bounceRate: number;
  conversionRate: number;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface DeviceData {
  device: 'desktop' | 'mobile' | 'tablet';
  sessions: number;
  percentage: number;
}

export interface BrowserData {
  browser: string;
  sessions: number;
  percentage: number;
}

export interface LocationData {
  country: string;
  sessions: number;
  percentage: number;
}

export interface AnalyticsData {
  metrics: VisitMetrics;
  pageViews: PageView[];
  visitsOverTime: TimeSeriesData[];
  devices: DeviceData[];
  browsers: BrowserData[];
  locations: LocationData[];
}

export interface AnalyticsFilters {
  period: 'day' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
  page?: string;
} 