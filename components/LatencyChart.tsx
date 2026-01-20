
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonitorLog } from '../types';

interface LatencyChartProps {
  logs: MonitorLog[];
}

export const LatencyChart: React.FC<LatencyChartProps> = ({ logs }) => {
  const data = logs.slice(-20).map(log => ({
    time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    ms: log.latency,
    status: log.status
  }));

  if (data.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-stone-400 text-xs border-2 border-dashed border-stone-200 rounded-md">
        NO DATA YET
      </div>
    );
  }

  return (
    <div className="h-32 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="time" hide />
          <YAxis 
            fontSize={10} 
            tick={{ fill: '#78716c' }} 
            axisLine={false} 
            tickLine={false} 
            unit="ms" 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '2px solid #292524', 
              borderRadius: '6px',
              fontSize: '10px',
              fontFamily: 'monospace'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="ms" 
            stroke="#ea580c" 
            strokeWidth={2} 
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
