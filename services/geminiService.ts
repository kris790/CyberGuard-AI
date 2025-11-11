import { GoogleGenAI, Type } from "@google/genai";
import type { Alert, Vulnerability } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export interface AlertExplanation {
  summary: string;
  riskScore: number;
  recommendation: string;
}

export interface VulnerabilityAnalysis {
  contextualSummary: string;
  prioritizationScore: number;
  strategicRecommendation: string;
}

export async function getAlertExplanation(alert: Omit<Alert, 'aiSummary' | 'aiRiskScore' | 'aiRecommendation'>): Promise<AlertExplanation> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }

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
        contents: `You are a cybersecurity expert for a platform called CyberGuard AI. Your user is an IT administrator, not a security specialist. Analyze the following security alert data, paying close attention to the mapped MITRE ATT&CK framework context. Provide a response in JSON format.

        The response must contain:
        1. "summary": A 1-2 sentence plain English summary of the threat. Explain WHAT it is and WHY it's potentially malicious, incorporating the MITRE tactic.
        2. "riskScore": A numerical risk score from 1 (very low) to 10 (critical), based on the provided data and MITRE context. A process spawned by an office product (like WINWORD.EXE) should have a higher risk.
        3. "recommendation": A clear, single, actionable next step for the IT administrator (e.g., "Isolate the endpoint from the network immediately.").
        
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
                    description: "A 1-2 sentence plain English summary of the threat."
                },
                riskScore: { 
                    type: Type.NUMBER,
                    description: "A numerical risk score from 1 to 10."
                },
                recommendation: { 
                    type: Type.STRING,
                    description: "A single, actionable next step for the IT administrator."
                },
            },
            required: ["summary", "riskScore", "recommendation"],
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

export async function getVulnerabilityAnalysis(vulnerability: Vulnerability): Promise<VulnerabilityAnalysis> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }

    // Fix: Use correct property 'affectedAsset' instead of 'asset' and 'cveId' instead of 'id'.
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