export enum Severity {
  Critical = 'Critical',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
  Info = 'Info',
}

export interface Metric {
  title: string;
  value: string;
  change: string;
  changeType?: 'increase' | 'decrease'; // Make optional for new metric card
}

export interface Alert {
  id: string;
  timestamp: string;
  endpoint: string;
  user: string;
  processName: string;
  parentProcessName?: string;
  filePath: string;
  commandLine: string;
  ipAddress?: string;
  severity: Severity;
  status: 'New' | 'Investigating' | 'Resolved';
  mitreTactic?: string;
  mitreTechnique?: string;
}

// Fix: Added missing Threat and Incident type definitions.
export interface Threat {
  id: string;
  name: string;
  severity: Severity;
  timestamp: string;
}

export interface Incident {
  id: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  severity: Severity;
  assignedTo: string;
}

export interface Vulnerability {
  id: string;
  cveId: string;
  name: string;
  severity: Severity;
  affectedAsset: string;
  description: string;
  publishedDate: string;
  cveLink: string;
  remediation: string;
}