import { GoogleGenAI, Type } from "@google/genai";
import type { Alert, Vulnerability } from '../types';

export interface AlertExplanation {
  summary: string;
  riskScore: number;
  recommendation: string;
  rationale: string[];
  remediationCommands: {
    powershell: string;
    bash: string;
  };
}

export interface VulnerabilityAnalysis {
  contextualSummary: string;
  prioritizationScore: number;
  strategicRecommendation: string;
}

// ============================================================================
// MOCK BACKEND LOGIC
// In a production environment, this logic would live on a secure backend server.
// The frontend would call an API endpoint, which would then execute this code.
// We are simulating this separation of concerns here as per directive AI-01.
// ============================================================================

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function _mockBackendAlertAnalysis(alert: Omit<Alert, 'aiSummary' | 'aiRiskScore' | 'aiRecommendation'>): Promise<AlertExplanation> {
  const alertData = JSON.stringify({
      processName: alert.processName,
      parentProcessName: alert.parentProcessName,
      filePath: alert.filePath,
      commandLine: alert.commandLine,
      ipAddress: alert.ipAddress,
      user: alert.user,
      severity: alert.severity,
      mitreTactic: alert.mitreTactic,
      mitreTechnique: alert.mitreTechnique,
  }, null, 2);

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `You are a Senior Cybersecurity Analyst AI for a platform called CyberGuard AI. Your task is to analyze a security alert from an endpoint and provide a concise, actionable report for an IT administrator, who is not a security specialist. Your response must be a single, valid JSON object.

Your analysis should be:
1.  **Accurate and Context-Aware:** Use all provided data, including MITRE ATT&CK framework information, to form your analysis. A process spawned by an office product (like WINWORD.EXE) should have a higher risk.
2.  **Clear and Concise:** Explain the threat in plain English, avoiding overly technical jargon where possible.
3.  **Actionable:** Provide a clear recommendation and specific, copy-and-paste ready remediation commands for both Windows (PowerShell) and Linux/macOS (Bash).

Alert Data:
${alertData}
        `,
        config: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                summary: { 
                    type: Type.STRING,
                    description: "A concise, one-sentence explanation of the threat in plain English."
                },
                riskScore: { 
                    type: Type.INTEGER,
                    description: "A numerical risk score from 1 (low) to 10 (critical)."
                },
                recommendation: { 
                    type: Type.STRING,
                    description: "A single, actionable next step for the IT administrator."
                },
                rationale: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "An array of 2-3 short strings, each highlighting a key data point that justifies the risk score."
                },
                remediationCommands: {
                    type: Type.OBJECT,
                    properties: {
                        powershell: { type: Type.STRING, description: "A specific, safe, and effective PowerShell command to remediate the threat." },
                        bash: { type: Type.STRING, description: "A specific, safe, and effective Bash command for equivalent remediation on Linux/macOS." }
                    },
                    required: ['powershell', 'bash']
                }
            },
            required: ["summary", "riskScore", "recommendation", "rationale", "remediationCommands"],
          }
        }
    });
    
    const parsed = JSON.parse(response.text);
    return parsed as AlertExplanation;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
}

async function _mockBackendVulnerabilityAnalysis(vulnerability: Vulnerability): Promise<VulnerabilityAnalysis> {
    const vulnData = JSON.stringify({
        cveId: vulnerability.cveId,
        description: vulnerability.description,
        severity: vulnerability.severity,
        asset: vulnerability.affectedAsset,
    }, null, 2);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `You are a senior cybersecurity strategist for a platform called CyberGuard AI. Analyze the following vulnerability data in the context of its affected asset. Provide a response in JSON format.

            The response must contain:
            1. "contextualSummary": A 1-2 sentence summary explaining the business risk. Why is this CVE on this specific asset a problem? What could an attacker achieve?
            2. "prioritizationScore": A numerical score from 1 (low priority) to 10 (critical priority) indicating how urgently this should be patched. Consider the static severity but also the potential role of the asset (e.g., a web server is more critical).
            3. "strategicRecommendation": A high-level, actionable recommendation for the IT administrator (e.g., "Patch immediately within the next 24 hours." or "Schedule for the next standard patch cycle.").
            
            Vulnerability Data:
            ${vulnData}
            `,
            config: {
                temperature: 0.2,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        contextualSummary: {
                            type: Type.STRING,
                            description: "A 1-2 sentence summary explaining the business risk of this vulnerability on the specific asset."
                        },
                        prioritizationScore: {
                            type: Type.NUMBER,
                            description: "A numerical prioritization score from 1 to 10."
                        },
                        strategicRecommendation: {
                            type: Type.STRING,
                            description: "A high-level, actionable recommendation for patching."
                        },
                    },
                    required: ["contextualSummary", "prioritizationScore", "strategicRecommendation"],
                }
            }
        });

        const parsed = JSON.parse(response.text);
        return parsed as VulnerabilityAnalysis;
    } catch (error) {
        console.error("Error calling Gemini API for vulnerability analysis:", error);
        throw new Error("Failed to get analysis from Gemini API.");
    }
}

// ============================================================================
// PUBLIC API SERVICE
// These functions simulate calling a backend API. They are what the frontend
// components will import and use.
// ============================================================================

// A helper to simulate network latency
const FAKE_NETWORK_LATENCY_MS = 500;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAlertExplanation(alert: Omit<Alert, 'aiSummary' | 'aiRiskScore' | 'aiRecommendation'>): Promise<AlertExplanation> {
  // In a real app, this would be a fetch call to a backend endpoint:
  // const response = await fetch('/api/analyze/alert', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(alert),
  // });
  // if (!response.ok) { throw new Error('Failed to get analysis from backend.'); }
  // return response.json();

  console.log("SIMULATING API CALL to /api/analyze/alert with payload:", alert);
  await sleep(FAKE_NETWORK_LATENCY_MS);
  
  // Calling the mock backend function
  return _mockBackendAlertAnalysis(alert);
}

export async function getVulnerabilityAnalysis(vulnerability: Vulnerability): Promise<VulnerabilityAnalysis> {
  // In a real app, this would be a fetch call to a backend endpoint:
  // const response = await fetch('/api/analyze/vulnerability', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(vulnerability),
  // });
  // if (!response.ok) { throw new Error('Failed to get analysis from backend.'); }
  // return response.json();
  
  console.log("SIMULATING API CALL to /api/analyze/vulnerability with payload:", vulnerability);
  await sleep(FAKE_NETWORK_LATENCY_MS);

  // Calling the mock backend function
  return _mockBackendVulnerabilityAnalysis(vulnerability);
}