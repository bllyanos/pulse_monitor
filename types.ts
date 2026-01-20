
export interface MonitorLog {
  timestamp: number;
  status: 'UP' | 'DOWN' | 'PENDING' | 'ERROR';
  statusCode: number | null;
  latency: number; // ms
  message?: string;
}

export interface Monitor {
  id: string;
  name: string;
  url: string;
  interval: number; // seconds
  isActive: boolean;
  logs: MonitorLog[];
}

export enum StatusColor {
  UP = 'text-orange-700 bg-orange-50 border-orange-700',
  DOWN = 'text-rose-700 bg-rose-50 border-rose-700',
  ERROR = 'text-amber-700 bg-amber-50 border-amber-700',
  PENDING = 'text-stone-500 bg-stone-50 border-stone-500'
}
