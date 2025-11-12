
import React from 'react';
import { Severity } from '../types';
import type { Threat } from '../types';

const severityStyles: Record<Severity, string> = {
  [Severity.Critical]: 'bg-red-500',
  [Severity.High]: 'bg-orange-500',
  [Severity.Medium]: 'bg-yellow-500',
  [Severity.Low]: 'bg-blue-500',
  [Severity.Info]: 'bg-gray-400',
};

const ThreatItem: React.FC<Threat> = ({ name, severity, timestamp }) => (
    <div className="flex items-center p-3 border-b border-gray-200 last:border-b-0">
        <div className={`w-2.5 h-2.5 rounded-full mr-3 flex-shrink-0 ${severityStyles[severity]}`}></div>
        <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 truncate" title={name}>{name}</p>
            <p className="text-xs text-gray-500">{severity}</p>
        </div>
        <p className="text-xs text-gray-500 ml-2 flex-shrink-0">{new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
    </div>
);

const SkeletonListItem: React.FC = () => (
    <div className="p-3 border-b border-gray-200 last:border-b-0">
      <div className="flex justify-between items-center animate-pulse">
        <div className="flex items-center flex-1">
          <div className="w-2.5 h-2.5 rounded-full mr-3 bg-gray-300"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-12 ml-2"></div>
      </div>
    </div>
  );

const ThreatFeed: React.FC<{ threats: Threat[]; isLoading: boolean }> = ({ threats, isLoading }) => {
  return (
    <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Live Threat Feed</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <>
            <SkeletonListItem />
            <SkeletonListItem />
            <SkeletonListItem />
            <SkeletonListItem />
            <SkeletonListItem />
          </>
        ) : (
          threats.map((threat) => (
            <ThreatItem key={threat.id} {...threat} />
          ))
        )}
      </div>
    </div>
  );
};

export default ThreatFeed;
