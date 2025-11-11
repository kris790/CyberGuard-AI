import React, { useState } from 'react';
import MetricCard from './MetricCard';
import AlertDetailsPanel from './AlertDetailsPanel';
import VulnerabilityDetailsPanel from './VulnerabilityDetailsPanel';
import { Alert, Severity, Vulnerability } from '../types';
import { getAlertExplanation, getVulnerabilityAnalysis } from '../services/geminiService';
import type { AlertExplanation, VulnerabilityAnalysis } from '../services/geminiService';

// Mock data for alerts, enriched with data for AI service
const mockAlerts: Alert[] = [
  {
    id: '1',
    timestamp: '2023-10-27T10:00:00Z',
    severity: Severity.High,
    endpoint: 'WS-FINANCE-03',
    user: 'j.doe',
    processName: 'powershell.exe',
    parentProcessName: 'explorer.exe',
    filePath: 'C:\\Windows\\System32\\',
    commandLine: 'powershell -enc JABjAGw...',
    ipAddress: '198.51.100.24',
    mitreTactic: 'Execution',
    mitreTechnique: 'T1059.001',
    status: 'New',
  },
  {
    id: '2',
    timestamp: '2023-10-27T09:45:00Z',
    severity: Severity.Medium,
    endpoint: 'WEB-SRV-01',
    user: 'SYSTEM',
    processName: 'svchost.exe',
    parentProcessName: 'services.exe',
    filePath: 'C:\\Windows\\System32\\',
    commandLine: 'svchost.exe -k netsvcs -p',
    ipAddress: '203.0.113.10',
    mitreTactic: 'Persistence',
    mitreTechnique: 'T1543.003',
    status: 'Investigating',
  },
];

// Mock data for vulnerabilities
const mockVulnerabilities: Vulnerability[] = [
  {
    id: 'vuln-1',
    cveId: 'CVE-2021-44228',
    name: 'Apache Log4j Remote Code Execution',
    severity: Severity.Critical,
    affectedAsset: 'prod-web-server-01',
    description: 'A critical vulnerability in Apache Log4j (Log4Shell) allows for remote code execution.',
    publishedDate: '2021-12-10',
    cveLink: 'https://nvd.nist.gov/vuln/detail/CVE-2021-44228',
    remediation: 'Upgrade Apache Log4j to version 2.17.1 or later.',
  },
  {
    id: 'vuln-2',
    cveId: 'CVE-2023-29357',
    name: 'Windows Kernel Elevation of Privilege',
    severity: Severity.High,
    affectedAsset: 'finance-dc-02',
    description: 'An elevation of privilege vulnerability exists in the Windows Kernel.',
    publishedDate: '2023-05-26',
    cveLink: 'https://nvd.nist.gov/vuln/detail/CVE-2023-29357',
    remediation: 'Install the latest Windows security updates.',
  },
];

const Dashboard: React.FC = () => {
  const [alerts] = useState<Alert[]>(mockAlerts);
  const [vulnerabilities] = useState<Vulnerability[]>(mockVulnerabilities);

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);

  const [alertAnalysis, setAlertAnalysis] = useState<AlertExplanation | null>(null);
  const [isAlertAnalysisLoading, setIsAlertAnalysisLoading] = useState(false);
  const [alertAnalysisError, setAlertAnalysisError] = useState<string | null>(null);

  const [vulnerabilityAnalysis, setVulnerabilityAnalysis] = useState<VulnerabilityAnalysis | null>(null);
  const [isVulnerabilityAnalysisLoading, setIsVulnerabilityAnalysisLoading] = useState(false);
  const [vulnerabilityAnalysisError, setVulnerabilityAnalysisError] = useState<string | null>(null);


  const handleAlertClick = async (alert: Alert) => {
    setSelectedAlert(alert);
    setSelectedVulnerability(null);
    setIsAlertAnalysisLoading(true);
    setAlertAnalysis(null);
    setAlertAnalysisError(null);
    try {
      const analysis = await getAlertExplanation(alert);
      setAlertAnalysis(analysis);
    } catch (error) {
      console.error("Failed to get alert analysis:", error);
      setAlertAnalysisError("Failed to generate AI analysis. Please check your API key and connection.");
    } finally {
      setIsAlertAnalysisLoading(false);
    }
  };

  const handleVulnerabilityClick = async (vulnerability: Vulnerability) => {
    setSelectedVulnerability(vulnerability);
    setSelectedAlert(null);
    setIsVulnerabilityAnalysisLoading(true);
    setVulnerabilityAnalysis(null);
    setVulnerabilityAnalysisError(null);
    try {
        const analysis = await getVulnerabilityAnalysis(vulnerability);
        setVulnerabilityAnalysis(analysis);
    } catch (error) {
        console.error("Failed to get vulnerability analysis:", error);
        setVulnerabilityAnalysisError("Failed to generate AI analysis. Please check your API key and connection.");
    } finally {
        setIsVulnerabilityAnalysisLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Top Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard title="Endpoints Protected" value="1,284" change="+2%" />
        <MetricCard title="Threats Detected (24h)" value="12" change="-5%" />
        <MetricCard title="Critical Vulnerabilities" value={vulnerabilities.filter(v => v.severity === 'Critical').length.toString()} change="0%" />
        <MetricCard title="Compliance Score" value="98%" change="+1%" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        {/* Left Pane: Alert and Vulnerability Lists */}
        <div className="flex flex-col space-y-6 overflow-hidden">
          {/* Recent Incidents / Alerts Section */}
          <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Recent Incidents</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${selectedAlert?.id === alert.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
                  onClick={() => handleAlertClick(alert)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{alert.processName}</p>
                      <p className="text-sm text-gray-500">{alert.mitreTactic} / {alert.mitreTechnique}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${alert.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Vulnerability Management Section */}
          <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Vulnerability Assessment</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {vulnerabilities.map(vuln => (
                <div
                  key={vuln.id}
                  className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${selectedVulnerability?.id === vuln.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
                  onClick={() => handleVulnerabilityClick(vuln)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{vuln.cveId}</p>
                      <p className="text-sm text-gray-500">{vuln.affectedAsset}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${vuln.severity === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                      {vuln.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Pane: Details Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 overflow-y-auto">
          {selectedAlert && (
            <AlertDetailsPanel
              alert={selectedAlert}
              analysis={alertAnalysis}
              isLoading={isAlertAnalysisLoading}
              error={alertAnalysisError}
            />
          )}
          {selectedVulnerability && (
            <VulnerabilityDetailsPanel
              vulnerability={selectedVulnerability}
              analysis={vulnerabilityAnalysis}
              isLoading={isVulnerabilityAnalysisLoading}
              error={vulnerabilityAnalysisError}
            />
          )}
          {!selectedAlert && !selectedVulnerability && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <p>Select an incident or vulnerability to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;