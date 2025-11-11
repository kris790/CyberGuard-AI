import { GoogleGenAI, Type } from "@google/genai";
import type { Alert } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export interface AlertExplanation {
  summary: string;
  riskScore: number;
  recommendation: string;
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