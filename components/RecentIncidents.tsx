
import React from 'react';
import { Severity } from '../types';
import type { Incident } from '../types';

const severityColors: Record<Severity, string> = {
    [Severity.Critical]: 'text-red-400',
    [Severity.High]: 'text-orange-400',
    [Severity.Medium]: 'text-yellow-400',
    [Severity.Low]: 'text-blue-400',
    [Severity.Info]: 'text-gray-400',
};

const statusColors: Record<Incident['status'], string> = {
    'Open': 'bg-red-500/20 text-red-300',
    'In Progress': 'bg-yellow-500/20 text-yellow-300',
    'Resolved': 'bg-green-500/20 text-green-300',
};

const IncidentItem: React.FC<Incident> = ({ description, status, severity, assignedTo }) => (
    <div className="p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
        <div className="flex justify-between items-start">
            <p className="text-sm text-gray-200 flex-1 pr-4">{description}</p>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[status]}`}>{status}</span>
        </div>
        <div className="flex items-center text-xs text-gray-400 mt-2">
            <span className={`font-semibold ${severityColors[severity]}`}>{severity}</span>
            <span className="mx-2 text-gray-600">|</span>
            <span>Assigned to: {assignedTo}</span>
        </div>
    </div>
);


const RecentIncidents: React.FC<{ incidents: Incident[] }> = ({ incidents }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Incidents</h3>
      <div className="space-y-3">
        {incidents.map((incident) => (
          <IncidentItem key={incident.id} {...incident} />
        ))}
      </div>
      <button className="mt-4 w-full text-center text-sm text-blue-400 hover:text-blue-300">
        Go to Case Management
      </button>
    </div>
  );
};

export default RecentIncidents;
