
import React from 'react';
import type { Metric } from '../types';
import { TrendingUpIcon, TrendingDownIcon } from './IconComponents';

const MetricCard: React.FC<Metric> = ({ title, value, change, changeType }) => {
  const isIncrease = changeType === 'increase';
  // For threats, an increase is bad (red). For compliance, an increase is good (green).
  // This logic determines color based on title context.
  const isBadChange = title.toLowerCase().includes('threat') || title.toLowerCase().includes('vulnerabilities');
  
  let changeColor = '';
  if (isIncrease) {
    changeColor = isBadChange ? 'text-red-500' : 'text-green-500';
  } else {
    changeColor = isBadChange ? 'text-green-500' : 'text-red-500';
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</h4>
      <div className="mt-2 flex items-baseline">
        <p className="text-3xl font-bold text-white">{value}</p>
        <div className={`ml-2 flex items-baseline text-sm font-semibold ${changeColor}`}>
          {isIncrease ? <TrendingUpIcon /> : <TrendingDownIcon />}
          <span className="ml-1">{change}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">vs. last 24h</p>
    </div>
  );
};

export default MetricCard;
