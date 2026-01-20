
import React from 'react';
import { StatusColor } from '../types';

interface StatusBadgeProps {
  status: 'UP' | 'DOWN' | 'PENDING' | 'ERROR';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colorClass = StatusColor[status];
  
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold border-2 rounded-md ${colorClass} uppercase tracking-tighter`}>
      {status}
    </span>
  );
};
