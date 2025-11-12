import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';
import AlertDetailsPanel from './AlertDetailsPanel';
import VulnerabilityDetailsPanel from './VulnerabilityDetailsPanel';
import { Alert, Severity, Threat, Vulnerability } from '../types';
import { getAlertExplanation, getVulnerabilityAnalysis } from '../services/geminiService';
import type { AlertExplanation, VulnerabilityAnalysis } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';
import ThreatFeed from './ThreatFeed';

const SkeletonMetricCard: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="mt-4 h-8 bg-gray-300 rounded w-1/2"></div>
    <div className="mt-2 h-3 bg-gray-200 rounded w-1/4"></div>
  </div>
);

const SkeletonListItem: React.FC = () => (
  <div className="p-4 border-b border-gray-200">
    <div className="flex justify-between items-center">
      <div>
        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-48"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded-full w-16"></div>
    </div>
  </div>
);


const Dashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);

  const [alertAnalysis, setAlertAnalysis] = useState<AlertExplanation | null>(null);
  const [isAlertAnalysisLoading, setIsAlertAnalysisLoading] = useState(false);
  const [alertAnalysisError, setAlertAnalysisError] = useState<string | null>(null);

  const [vulnerabilityAnalysis, setVulnerabilityAnalysis] = useState<VulnerabilityAnalysis | null>(null);
  const [isVulnerabilityAnalysisLoading, setIsVulnerabilityAnalysisLoading] = useState(false);
  const [vulnerabilityAnalysisError, setVulnerabilityAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const alertsPromise = supabase.from('alerts').select('*').order('timestamp', { ascending: false });
        const vulnerabilitiesPromise = supabase.from('vulnerabilities').select('*').order('published_date', { ascending: false });
        
        const mockThreats: Threat[] = [
          { id: 't1', name: 'Anomalous PowerShell activity', severity: Severity.High, timestamp: new Date(Date.now() - 10000).toISOString() },
          { id: 't2', name: 'Outbound connection to known C2 server', severity: Severity.Critical, timestamp: new Date(Date.now() - 65000).toISOString() },
          { id: 't3', name: 'Multiple failed login attempts from Tor', severity: Severity.Medium, timestamp: new Date(Date.now() - 125000).toISOString() },
          { id: 't4', name: 'Suspicious file modification in /etc/passwd', severity: Severity.High, timestamp: new Date(Date.now() - 305000).toISOString() },
          { id: 't5', name: 'Nmap port scan detected from internal IP', severity: Severity.Low, timestamp: new Date(Date.now() - 605000).toISOString() },
        ];

        const [alertsResponse, vulnerabilitiesResponse] = await Promise.all([
          alertsPromise,
          vulnerabilitiesPromise,
        ]);
        
        if (alertsResponse.error) throw new Error(`Alerts fetch failed: ${alertsResponse.error.message}`);
        if (vulnerabilitiesResponse.error) throw new Error(`Vulnerabilities fetch failed: ${vulnerabilitiesResponse.error.message}`);
        
        setAlerts(alertsResponse.data as Alert[]);
        setVulnerabilities(vulnerabilitiesResponse.data as Vulnerability[]);
        setThreats(mockThreats);

      } catch (error: any) {
        console.error("Error fetching data:", error);
        setFetchError("Failed to load dashboard data. Please ensure your Supabase connection is configured correctly and the tables exist.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


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

  if (fetchError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-md max-w-lg">
          <div className="flex">
            <div className="py-1">
              <svg className="h-6 w-6 text-red-400 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-red-800">Error Loading Dashboard Data</p>
              <p className="text-sm text-red-700 mt-1">There was a problem communicating with the backend.</p>
              <code className="block bg-red-100 text-red-900 text-xs p-2 rounded mt-2 font-mono break-all whitespace-pre-wrap">
                {fetchError}
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Top Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {isLoading ? (
          <>
            <SkeletonMetricCard />
            <SkeletonMetricCard />
            <SkeletonMetricCard />
            <SkeletonMetricCard />
          </>
        ) : (
          <>
            <MetricCard title="Endpoints Protected" value="1,284" change="+2%" />
            <MetricCard title="Threats Detected (24h)" value={alerts.length.toString()} change="-5%" />
            <MetricCard title="Critical Vulnerabilities" value={vulnerabilities.filter(v => v.severity === 'Critical').length.toString()} change="0%" />
            <MetricCard title="Compliance Score" value="98%" change="+1%" />
          </>
        )}
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
              {isLoading ? (
                <>
                  <SkeletonListItem />
                  <SkeletonListItem />
                  <SkeletonListItem />
                </>
              ) : (
                alerts.map(alert => (
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
                ))
              )}
            </div>
          </div>

          {/* New Vulnerability Management Section */}
          <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Vulnerability Assessment</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                  <>
                    <SkeletonListItem />
                    <SkeletonListItem />
                  </>
              ) : (
                vulnerabilities.map(vuln => (
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
                ))
              )}
            </div>
          </div>

          {/* Live Threat Feed Section */}
          <ThreatFeed threats={threats} isLoading={isLoading} />
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