# CyberGuard AI - Intelligent Cybersecurity Dashboard

![CyberGuard AI Dashboard Screenshot](https://storage.googleapis.com/aistudio-hosting/project-images/cyberguard-ai-screenshot.png)

CyberGuard AI is a modern, proof-of-concept cybersecurity dashboard designed to demonstrate the power of AI in security operations. It leverages Google's Gemini 2.5 Pro model to provide IT administrators and security analysts with immediate, context-aware intelligence, transforming raw security alerts and vulnerability data into clear, actionable insights.

This application showcases an AI-first approach to security, integrating intelligent analysis directly into the incident response and vulnerability management workflow.

---

## ✨ Key Features

- **Unified Security Dashboard**: A single-pane-of-glass view of key security metrics, recent incidents, critical vulnerabilities, and a live threat feed.
- **AI-Powered Alert Analysis**: Generates plain-English summaries, a contextual risk score (1-10), and a clear rationale for security alerts, helping analysts understand threats instantly.
- **AI-Generated Remediation**: Provides specific, copy-and-paste remediation commands for both PowerShell (Windows) and Bash (Linux/macOS) to accelerate response times.
- **AI-Contextualized Vulnerability Prioritization**: Goes beyond static CVE scores by using Gemini to assess a vulnerability's business risk on a specific asset, providing a contextual prioritization score and a strategic patching recommendation.
- **Interactive UI**: A clean, responsive interface that allows users to seamlessly switch between high-level overviews and deep, AI-powered analysis for any selected item.
- **Secure Authentication**: User login and session management handled by Supabase Auth.

---

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Backend-as-a-Service**: Supabase (for authentication and database)

---

## 📂 Project Structure

The project uses a modular structure to promote maintainability and scalability.

```
/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx               # Main dashboard view
│   │   ├── AlertDetailsPanel.tsx       # Details panel for alerts with AI analysis
│   │   ├── VulnerabilityDetailsPanel.tsx # Details panel for vulnerabilities with AI analysis
│   │   ├── Header.tsx                  # Top navigation bar
│   │   ├── Sidebar.tsx                 # Main sidebar navigation
│   │   ├── MetricCard.tsx              # Reusable card for key metrics
│   │   ├── ThreatFeed.tsx              # Live threat feed component
│   │   ├── AuthGate.tsx                # Handles routing between login and app
│   │   └── LoginPage.tsx               # User authentication page
│   ├── services/
│   │   ├── geminiService.ts            # Handles all communication with the Gemini API
│   │   └── supabaseClient.ts           # Configures the Supabase client
│   ├── contexts/
│   │   └── AuthContext.tsx             # Manages authentication state
│   ├── types.ts                        # Centralized TypeScript type definitions
│   ├── App.tsx                         # Root component for the authenticated app
│   └── index.tsx                       # Application entry point
├── index.html                          # Main HTML file
└── README.md                           # This file
```

---

## 🚀 Core Functionality Deep Dive

### AI-Powered Threat Analysis & Response

The core innovation of CyberGuard AI is its deep integration of AI throughout the incident lifecycle.

1.  **User Interaction**: An administrator selects a high-risk alert from the "Recent Incidents" list in the `Dashboard.tsx` component.
2.  **Specialized API Call**: This action triggers a call to the `getAlertExplanation` function in `geminiService.ts`, passing all relevant alert data (process details, user, MITRE ATT&CK context, etc.).
3.  **Advanced Prompt Engineering**: A carefully crafted prompt instructs the `gemini-2.5-pro` model to act as a senior cybersecurity analyst. By defining a strict JSON schema for the response, we ensure a predictable, structured output.
4.  **Enriched JSON Response**: The Gemini API returns a rich object containing:
    -   `summary`: A concise explanation of the threat.
    -   `riskScore`: A numerical score from 1-10.
    -   `rationale`: A bulleted list explaining *why* the score was given.
    -   `recommendation`: A high-level strategic next step.
    -   `remediationCommands`: Specific, actionable commands for both PowerShell and Bash.
5.  **Dynamic & Actionable UI**: The `AlertDetailsPanel.tsx` component receives this data and dynamically renders the full analysis, including the AI's reasoning and copy-to-clipboard remediation commands.

### AI-Powered Vulnerability Prioritization

This same AI-first approach is applied to vulnerability management. Instead of relying solely on static CVSS scores, the `getVulnerabilityAnalysis` service sends the CVE and affected asset context to Gemini to generate a **business-aware prioritization score** and a strategic recommendation, allowing teams to focus on the vulnerabilities that pose the greatest actual risk to their organization.

---

## 🔮 Future Improvements

With a mature foundation, the next strategic steps for CyberGuard AI could include:

-   **Full End-to-End Automation**: Evolve from demonstrating recommendations to a full SOAR-like capability where users can trigger automated response workflows (e.g., "Isolate Endpoint," "Block IP").
-   **Natural Language Querying**: Implement a search bar that allows administrators to ask plain-English questions (e.g., `"Show me all PowerShell activity on domain controllers this week"`) and uses Gemini to translate them into data queries.
-   **Role-Based Access Control (RBAC)**: Introduce different user roles (e.g., `Administrator`, `Analyst`) with distinct permissions.
-   **Historical Reporting & Analytics**: Build a dedicated reporting section with dashboards and charts to visualize security trends over time.
-   **Third-Party Integrations**: Move from a self-contained demo to full API integrations with SIEMs (Splunk), ITSM tools (ServiceNow), and identity providers (Azure AD).
