import React, { useState, useCallback } from 'react';
import { Severity } from '../types';
import type { Metric, Alert, Vulnerability } from '../types';
import { getAlertExplanation } from '../services/geminiService';
import type { AlertExplanation } from '../services/geminiService';
import MetricCard from './MetricCard';
import { SparklesIcon, XIcon } from './IconComponents';
import VulnerabilityList from './VulnerabilityList';

const mockMetrics: Metric[] = [
  { title: 'Protected Endpoints', value: '248', change: '+12', changeType: 'increase' },
  { title: 'Threats Detected (24h)', value: '18', change: '+3', changeType: 'increase' },
  { title: 'Incidents Escalated', value: '2', change: '+1', changeType: 'increase' },
  { title: 'Avg. Time to Detect', value: '8m', change: '-12%', changeType: 'decrease' },
];

const mockAlerts: Alert[] = [
  { id: 'ALERT-001', timestamp: '2 mins ago', endpoint: 'WS-FINANCE-03', user: 'j.doe', processName: 'powershell.exe', parentProcessName: 'WINWORD.EXE', filePath: 'C:\\Users\\j.doe\\Downloads\\', commandLine: 'powershell -enc JABjAGw...', severity: Severity.Critical, status: 'New', ipAddress: '198.51.100.24', mitreTactic: 'Execution', mitreTechnique: 'T1059.001' },
  { id: 'ALERT-002', timestamp: '15 mins ago', endpoint: 'WEB-SRV-01', user: 'SYSTEM', processName: 'svchost.exe', parentProcessName: 'services.exe', filePath: 'C:\\Windows\\System32\\', commandLine: 'svchost.exe -k netsvcs -p', severity: Severity.High, status: 'New', ipAddress: '203.0.113.10', mitreTactic: 'Defense Evasion', mitreTechnique: 'T1055' },
  { id: 'ALERT-003', timestamp: '45 mins ago', endpoint: 'LAPTOP-DEV-12', user: 'a.turing', processName: 'rundll32.exe', parentProcessName: 'explorer.exe', filePath: 'C:\\Users\\a.turing\\AppData\\Local\\Temp\\', commandLine: 'rundll32.exe malicious.dll,EntryPoint', severity: Severity.High, status: 'New', mitreTactic: 'Execution', mitreTechnique: 'T1218.011' },
  { id: 'ALERT-004', timestamp: '1 hour ago', endpoint: 'WS-MARKETING-08', user: 'c.babbage', processName: 'WINWORD.EXE', parentProcessName: 'OUTLOOK.EXE', filePath: 'C:\\Program Files\\Microsoft Office\\', commandLine: 'WINWORD.EXE /q "C:\\Users\\...\\invoice.docm"', severity: Severity.Medium, status: 'New', mitreTactic: 'Initial Access', mitreTechnique: 'T1566.001' },
  { id: 'ALERT-005', timestamp: '3 hours ago', endpoint: 'LAPTOP-HR-02', user: 'g.hopper', processName: 'java.exe', parentProcessName: 'cmd.exe', filePath: 'C:\\Program Files\\Java\\jre1.8.0_291\\bin\\', commandLine: 'java.exe -jar vulnerable-app.jar', severity: Severity.Low, status: 'New', mitreTactic: 'Execution', mitreTechnique: 'T1059' },
];

const mockVulnerabilities: Vulnerability[] = [
    { id: 'CVE-2023-38408', description: 'OpenSSH Remote Code Execution', severity: Severity.Critical, asset: 'WEB-SRV-01', status: 'New', remediation: 'Update OpenSSH to version 9.3p2 or later.', cveUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2023-38408' },
    { id: 'CVE-2023-29357', description: 'Microsoft SharePoint Server Privilege Escalation', severity: Severity.Critical, asset: 'SP-SERVER-01', status: 'New', remediation: 'Apply the latest SharePoint security updates from Microsoft.', cveUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2023-29357' },
    { id: 'CVE-2024-21413', description: 'Microsoft Outlook Remote Code Execution', severity: Severity.High, asset: 'WS-FINANCE-03', status: 'Patching', remediation: 'Enable "Protected View" for all attachments in Microsoft Office.', cveUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2024-21413' },
    { id: 'CVE-2024-3094', description: 'XZ Utils Backdoor', severity: Severity.Critical, asset: 'BUILD-SERVER-02', status: 'New', remediation: 'Downgrade XZ Utils to a version prior to 5.6.0.', cveUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2024-3094' },
    { id: 'CVE-2022-22965', description: 'Spring4Shell RCE', severity: Severity.High, asset: 'API-GATEWAY-01', status: 'Resolved', remediation: 'Upgrade Spring Framework to versions 5.3.18+ or 5.2.20+.', cveUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2022-22965' },
];


const severityStyles: Record<Severity, { bg: string; text: string }> = {
  [Severity.Critical]: { bg: 'bg-red-500/20', text: 'text-red-400' },
  [Severity.High]: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  [Severity.Medium]: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  [Severity.Low]: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  [Severity.Info]: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
};

const vulnStatusStyles: Record<Vulnerability['status'], string> = {
    'New': 'bg-red-500/20 text-red-300',
    'Patching': 'bg-yellow-500/20 text-yellow-300',
    'Resolved': 'bg-green-500/20 text-green-300',
};

const Dashboard: React.FC = () => {
    const [alerts] = useState<Alert[]>(mockAlerts);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [aiAnalysis, setAiAnalysis] = useState<AlertExplanation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [vulnerabilities] = useState<Vulnerability[]>(mockVulnerabilities.filter(v => v.severity === Severity.Critical || v.severity === Severity.High));
    const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);

    const handleSelectAlert = useCallback(async (alert: Alert) => {
        if (selectedAlert?.id === alert.id) return;
        
        setSelectedAlert(alert);
        setAiAnalysis(null);
        setError('');
        setIsLoading(true);

        try {
            const result = await getAlertExplanation(alert);
            setAiAnalysis(result);
        } catch (err) {
            setError('Failed to generate AI analysis. Please check your API key and try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedAlert]);

    const handleCloseDetails = () => {
        setSelectedAlert(null);
        setAiAnalysis(null);
    }

    const handleSelectVulnerability = (vulnerability: Vulnerability) => {
        setSelectedVulnerability(vulnerability);
    };

    const handleCloseVulnerabilityDetails = () => {
        setSelectedVulnerability(null);
    };

    const getRiskScoreColor = (score: number): string => {
        if (score >= 8) return 'bg-red-500';
        if (score >= 4) return 'bg-orange-500';
        return 'bg-blue-500';
    };

    const getRiskScoreTextColor = (score: number): string => {
        if (score >= 8) return 'text-red-400';
        if (score >= 4) return 'text-orange-400';
        return 'text-blue-400';
    };
    
    return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {mockMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">Security Alerts</h2>
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row">
                {/* Alerts List */}
                <div className={`w-full lg:flex-1 transition-all duration-300 ${selectedAlert ? 'hidden lg:block' : ''}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-700/50">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-gray-300">Endpoint</th>
                                    <th className="p-4 text-sm font-semibold text-gray-300">Process</th>
                                    <th className="p-4 text-sm font-semibold text-gray-300">Parent Process</th>
                                    <th className="p-4 text-sm font-semibold text-gray-300">Severity</th>
                                    <th className="p-4 text-sm font-semibold text-gray-300">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alerts.map(alert => (
                                    <tr key={alert.id} onClick={() => handleSelectAlert(alert)} className={`cursor-pointer border-b border-gray-700 hover:bg-gray-700/50 ${selectedAlert?.id === alert.id ? 'bg-blue-600/20' : ''}`}>
                                        <td className="p-4 text-sm text-white">{alert.endpoint} <span className="text-gray-400 block text-xs">by {alert.user}</span></td>
                                        <td className="p-4 text-sm text-gray-300 font-mono">{alert.processName}</td>
                                        <td className="p-4 text-sm text-gray-300 font-mono">{alert.parentProcessName}</td>
                                        <td className="p-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${severityStyles[alert.severity].bg} ${severityStyles[alert.severity].text}`}>
                                                {alert.severity}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-400">{alert.timestamp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Details Pane */}
                {selectedAlert && (
                    <div className="w-full lg:w-1/2 border-l border-gray-700 p-6 flex flex-col bg-gray-800 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">Alert Details</h3>
                        <button onClick={handleCloseDetails} className="text-gray-400 hover:text-white">
                            <XIcon />
                        </button>
                    </div>
                    
                    {/* AI Analysis Section */}
                    <div className="bg-gray-900/50 p-4 rounded-lg mb-6">
                        <h4 className="text-lg font-semibold text-white flex items-center mb-3">
                            <SparklesIcon className="text-blue-400 mr-2" />
                            AI-Assisted Triage
                        </h4>
                        {isLoading && (
                            <div className="flex items-center text-gray-300">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Analyzing threat...</span>
                            </div>
                        )}
                        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md text-sm">{error}</p>}
                        {aiAnalysis && (
                            <div className="space-y-4 animate-fade-in">
                                <div>
                                    <p className={`text-sm font-semibold ${getRiskScoreTextColor(aiAnalysis.riskScore)}`}>Risk Score: {aiAnalysis.riskScore}/10</p>
                                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                                        <div className={`${getRiskScoreColor(aiAnalysis.riskScore)} h-2.5 rounded-full`} style={{ width: `${aiAnalysis.riskScore * 10}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-300">Summary</p>
                                    <p className="text-sm text-gray-400">{aiAnalysis.summary}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-300">Recommendation</p>
                                    <p className="text-blue-300 bg-blue-900/40 p-3 rounded mt-1 font-medium">{aiAnalysis.recommendation}</p>
                                </div>
                            </div>
                        )}
                    </div>

                        {/* Raw Data & Actions */}
                    <div className="space-y-3 text-sm flex-grow">
                            <h4 className="text-lg font-semibold text-white mb-3">Raw Data</h4>
                            <div className="flex justify-between"><strong className="text-gray-400">Endpoint:</strong> <span className="text-gray-200 font-mono">{selectedAlert.endpoint}</span></div>
                            <div className="flex justify-between"><strong className="text-gray-400">User:</strong> <span className="text-gray-200 font-mono">{selectedAlert.user}</span></div>
                            <div className="flex justify-between"><strong className="text-gray-400">Process:</strong> <span className="text-gray-200 font-mono">{selectedAlert.processName}</span></div>
                            <div className="flex justify-between"><strong className="text-gray-400">Parent Process:</strong> <span className="text-gray-200 font-mono">{selectedAlert.parentProcessName}</span></div>
                            {selectedAlert.ipAddress && <div className="flex justify-between"><strong className="text-gray-400">IP Address:</strong> <span className="text-gray-200 font-mono">{selectedAlert.ipAddress}</span></div>}
                             {selectedAlert.mitreTechnique && (
                                <div className="flex justify-between">
                                    <strong className="text-gray-400">MITRE ATT&CK:</strong>
                                    <a href={`https://attack.mitre.org/techniques/${selectedAlert.mitreTechnique.replace('.', '/')}/`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-mono">
                                        {selectedAlert.mitreTactic} ({selectedAlert.mitreTechnique})
                                    </a>
                                </div>
                            )}
                            <div><strong className="text-gray-400">Command Line:</strong> <p className="text-gray-200 font-mono bg-gray-900 p-2 rounded mt-1 text-xs">{selectedAlert.commandLine}</p></div>
                    </div>
                    <div className="mt-6 flex space-x-3">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Isolate Endpoint</button>
                        <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Quarantine File</button>
                        <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-lg transition-colors">Ignore</button>
                    </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">Vulnerability Assessment</h2>
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className={`w-full lg:flex-1 transition-all duration-300 ${selectedVulnerability ? 'hidden lg:block' : ''}`}>
              <VulnerabilityList 
                vulnerabilities={vulnerabilities}
                onSelect={handleSelectVulnerability}
                selectedId={selectedVulnerability?.id || null}
              />
            </div>

            {selectedVulnerability && (
              <div className="w-full lg:w-1/2 border-l border-gray-700 p-6 flex flex-col bg-gray-800 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">Vulnerability Details</h3>
                  <button onClick={handleCloseVulnerabilityDetails} className="text-gray-400 hover:text-white">
                      <XIcon />
                  </button>
                </div>
                
                <div className="space-y-4 text-sm flex-grow">
                  <h4 className="text-lg font-semibold text-blue-300">{selectedVulnerability.id}</h4>
                  
                  <div className="flex justify-between items-center">
                    <strong className="text-gray-400">Severity:</strong> 
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${severityStyles[selectedVulnerability.severity].bg} ${severityStyles[selectedVulnerability.severity].text}`}>
                      {selectedVulnerability.severity}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <strong className="text-gray-400">Status:</strong> 
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${vulnStatusStyles[selectedVulnerability.status]}`}>
                      {selectedVulnerability.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between"><strong className="text-gray-400">Affected Asset:</strong> <span className="text-gray-200 font-mono">{selectedVulnerability.asset}</span></div>
                  
                  <div>
                    <strong className="text-gray-400">Description:</strong>
                    <p className="text-gray-300 mt-1">{selectedVulnerability.description}</p>
                  </div>
                  
                  <div>
                    <strong className="text-gray-400">Remediation:</strong>
                    <p className="text-green-300 bg-green-900/40 p-3 rounded mt-1 font-medium">{selectedVulnerability.remediation}</p>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <a href={selectedVulnerability.cveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                      View CVE Details
                  </a>
                  <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Initiate Patch</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;