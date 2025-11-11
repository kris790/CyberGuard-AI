import React from 'react';
import type { Metric } from '../types';
import { TrendingUpIcon, TrendingDownIcon } from './IconComponents';

const MetricCard: React.FC<Omit<Metric, 'changeType'>> = ({ title, value, change }) => {
  const isIncrease = change.startsWith('+');
  
  const isBadChange = title.toLowerCase().includes('threats') || title.toLowerCase().includes('vulnerabilities');
  
  let changeColor = '';
  if (isIncrease) {
    changeColor = isBadChange ? 'text-red-600' : 'text-green-600';
  } else {
    changeColor = isBadChange ? 'text-green-600' : 'text-red-600';
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h4>
      <div className="mt-2 flex items-baseline">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <div className={`ml-2 flex items-baseline text-sm font-semibold ${changeColor}`}>
          {isIncrease ? <TrendingUpIcon /> : <TrendingDownIcon />}
          <span className="ml-1">{change}</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-1">vs. last 24h</p>
    </div>
  );
};

export default MetricCard;