import React from 'react';
import { Alert } from '../types';
import { AlertExplanation } from '../services/geminiService';
import { SparklesIcon, InformationCircleIcon } from './IconComponents';

interface AlertDetailsPanelProps {
  alert: Alert;
  analysis: AlertExplanation | null;
  isLoading: boolean;
  error: string | null;
}

const DetailRow: React.FC<{ label: string; value?: string; children?: React.ReactNode }> = ({ label, value, children }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{children || value}</dd>
    </div>
);

const AlertDetailsPanel: React.FC<AlertDetailsPanelProps> = ({ alert, analysis, isLoading, error }) => {
    
    const getScoreColor = (score: number): string => {
        if (score >= 8) return 'bg-red-500';
        if (score >= 4) return 'bg-orange-500';
        return 'bg-blue-500';
    };
    
    return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-semibold text-gray-900">Incident Details</h3>
      <p className="mt-1 text-sm text-gray-500">Analysis for Alert ID: {alert.id}</p>
      
      {/* AI Analysis Section */}
      <div className="mt-6 border-t border-b border-gray-200 py-5">
        <h4 className="text-md font-semibold text-gray-800 flex items-center mb-3">
            <SparklesIcon className="text-blue-500 mr-2" />
            AI-Assisted Triage
        </h4>
        {isLoading && (
            <div className="flex items-center text-gray-500">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing threat with Gemini...</span>
            </div>
        )}
        {error && <p className="text-red-600 bg-red-50 p-3 rounded-md text-sm">{error}</p>}
        {analysis && (
            <div className="space-y-4 animate-fade-in">
                <div className="relative group">
                    <div className="flex items-center space-x-1 cursor-help">
                        <p className="text-sm font-medium text-gray-700">Risk Score: {analysis.riskScore}/10</p>
                        <InformationCircleIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div className={`${getScoreColor(analysis.riskScore)} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${analysis.riskScore * 10}%` }}></div>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <p className="font-bold text-center">Risk Score Meaning</p>
                        <p><span className="font-semibold text-blue-400">1-3 (Low):</span> Minor policy violation.</p>
                        <p><span className="font-semibold text-orange-400">4-7 (Medium):</span> Suspicious, requires investigation.</p>
                        <p><span className="font-semibold text-red-400">8-10 (Critical):</span> Active threat, immediate action required.</p>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-700">Summary</p>
                    <p className="text-sm text-gray-600">{analysis.summary}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-700">Recommendation</p>
                    <p className="text-sm text-blue-800 bg-blue-50 p-3 rounded mt-1 font-medium">{analysis.recommendation}</p>
                </div>
            </div>
        )}
      </div>

      {/* Raw Data Section */}
      <div className="mt-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3">Alert Data</h4>
        <dl>
            <DetailRow label="Endpoint" value={alert.endpoint} />
            <DetailRow label="User" value={alert.user} />
            <DetailRow label="Process" value={alert.processName} />
            <DetailRow label="Parent Process" value={alert.parentProcessName} />
            <DetailRow label="MITRE ATT&CK">
                <a href={`https://attack.mitre.org/techniques/${alert.mitreTechnique?.replace('.', '/')}/`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {alert.mitreTactic} ({alert.mitreTechnique})
                </a>
            </DetailRow>
            <DetailRow label="Command Line">
                <code className="text-xs bg-gray-100 p-2 rounded-md block break-words">{alert.commandLine}</code>
            </DetailRow>
        </dl>
      </div>

      <div className="mt-8 flex space-x-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Isolate Endpoint</button>
          <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Quarantine File</button>
      </div>
    </div>
  );
};

export default AlertDetailsPanel;