
import React from 'react';
import { Severity } from '../types';
import type { Threat } from '../types';

const severityStyles: Record<Severity, string> = {
  [Severity.Critical]: 'bg-red-500 border-red-400',
  [Severity.High]: 'bg-orange-500 border-orange-400',
  [Severity.Medium]: 'bg-yellow-500 border-yellow-400',
  [Severity.Low]: 'bg-blue-500 border-blue-400',
  [Severity.Info]: 'bg-gray-500 border-gray-400',
};

const ThreatItem: React.FC<Threat> = ({ name, severity, timestamp }) => (
    <div className="flex items-center p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
        <div className={`w-3 h-3 rounded-full mr-4 border-2 ${severityStyles[severity]}`}></div>
        <div className="flex-1">
            <p className="text-sm text-gray-200">{name}</p>
            <p className="text-xs text-gray-400">{severity}</p>
        </div>
        <p className="text-xs text-gray-500">{timestamp}</p>
    </div>
);


const ThreatFeed: React.FC<{ threats: Threat[] }> = ({ threats }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Live Threat Feed</h3>
      <div className="space-y-2">
        {threats.map((threat) => (
          <ThreatItem key={threat.id} {...threat} />
        ))}
      </div>
       <button className="mt-4 w-full text-center text-sm text-blue-400 hover:text-blue-300">
        View All Threats
      </button>
    </div>
  );
};

export default ThreatFeed;
