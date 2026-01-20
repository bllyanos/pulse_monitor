
import React from 'react';
import { Activity, Globe, Clock, Trash2, Power, PowerOff, ExternalLink } from 'lucide-react';
import { Monitor, MonitorLog } from '../types';
import { STYLES } from '../constants';
import { StatusBadge } from './StatusBadge';
import { LatencyChart } from './LatencyChart';

interface UrlCardProps {
  monitor: Monitor;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export const UrlCard: React.FC<UrlCardProps> = ({ monitor, onDelete, onToggle }) => {
  const latestLog: MonitorLog | undefined = monitor.logs[monitor.logs.length - 1];
  
  const uptimeCount = monitor.logs.filter(l => l.status === 'UP').length;
  const uptimePercent = monitor.logs.length > 0 
    ? Math.round((uptimeCount / monitor.logs.length) * 100) 
    : 100;

  return (
    <div className={`${STYLES.container} p-3 group transition-all duration-150 hover:shadow-[4px_4px_0px_0px_rgba(115,115,115,1)]`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-sm truncate uppercase tracking-tight">{monitor.name}</h3>
            <StatusBadge status={latestLog?.status || 'PENDING'} />
          </div>
          <div className="flex items-center gap-1 text-[10px] text-stone-500 font-medium">
            <Globe size={10} strokeWidth={2} />
            <a 
              href={monitor.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="truncate hover:text-orange-600 underline"
            >
              {monitor.url}
            </a>
            <ExternalLink size={10} />
          </div>
        </div>
        
        <div className="flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onToggle(monitor.id)}
            className={`${STYLES.btn} p-1 ${monitor.isActive ? 'bg-amber-50 text-amber-700 border-amber-700' : 'bg-orange-50 text-orange-700 border-orange-700'}`}
            title={monitor.isActive ? 'Pause' : 'Resume'}
          >
            {monitor.isActive ? <PowerOff size={14} /> : <Power size={14} />}
          </button>
          <button 
            onClick={() => onDelete(monitor.id)}
            className={`${STYLES.btn} p-1 bg-rose-50 text-rose-700 border-rose-700`}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-stone-50 p-2 rounded border-2 border-stone-200">
          <span className={STYLES.label}>Latency</span>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-lg">{latestLog?.latency || 0}</span>
            <span className="text-[10px] text-stone-500">ms</span>
          </div>
        </div>
        <div className="bg-stone-50 p-2 rounded border-2 border-stone-200">
          <span className={STYLES.label}>Status</span>
          <div className="font-bold text-lg">{latestLog?.statusCode || '---'}</div>
        </div>
        <div className="bg-stone-50 p-2 rounded border-2 border-stone-200">
          <span className={STYLES.label}>Uptime</span>
          <div className="font-bold text-lg">{uptimePercent}%</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className={STYLES.label}>Performance history</span>
          <div className="flex items-center gap-1 text-[9px] text-stone-400 font-bold uppercase">
            <Clock size={10} />
            Interval: {monitor.interval}s
          </div>
        </div>
        <LatencyChart logs={monitor.logs} />
      </div>
    </div>
  );
};
