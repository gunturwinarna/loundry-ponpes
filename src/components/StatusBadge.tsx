import React from 'react';
import { LaundryStatus } from '../types';
import { STATUS_CONFIG } from '../utils/statusHelper';

interface StatusBadgeProps {
  status: LaundryStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  showDot = true 
}) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-700',
    borderClass: 'border-slate-200',
    dotClass: 'bg-slate-400'
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border font-medium ${config.bgClass} ${config.textClass} ${config.borderClass} ${sizeClasses[size]} whitespace-nowrap`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
};
