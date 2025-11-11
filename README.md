# CyberGuard AI - Intelligent Cybersecurity Dashboard

![CyberGuard AI Dashboard Screenshot](https://storage.googleapis.com/aistudio-hosting/project-images/cyberguard-ai-screenshot.png)

CyberGuard AI is a modern, proof-of-concept cybersecurity dashboard designed for enterprise-grade threat detection, analysis, and operations. It leverages the power of Google's Gemini 2.5 Pro model to provide IT administrators and security analysts with immediate, context-aware intelligence, transforming raw security data into clear, actionable insights.

This application demonstrates a mature, AI-first approach to security operations, integrating intelligent analysis into every step of the incident response and vulnerability management lifecycle.

---

## ✨ Key Features

- **AI-Assisted Triage**: Generates plain-English summaries, risk scores, and recommendations for security alerts.
- **AI Explainability**: Builds trust by showing the key rationale and data points the AI used to determine its risk score.
- **AI-Powered Remediation**: Provides specific, copy-and-paste remediation commands (e.g., PowerShell, Bash) to move from analysis to action in seconds.
- **AI-Powered Vulnerability Context**: Goes beyond static CVE scores by using Gemini to assess a vulnerability's business risk on a specific asset, providing a contextual prioritization score.
- **Role-Based Access Control (RBAC)**: Simulates `Administrator` and `Analyst` roles, with UI controls that restrict critical actions to authorized users.
- **Comprehensive Audit Logging**: Tracks all critical user actions in an immutable audit trail for security, compliance, and accountability.
- **Automated Response Playbooks**: Demonstrates the execution of automated playbooks for high-severity threats, providing visibility into containment actions.
- **Platform Extensibility Hub**: A dedicated settings area showcases readiness for third-party integrations (Splunk, ServiceNow) and support for hybrid/on-premises deployment models.
- **Context-Rich Alerting**: Enriches alerts with parent process information and **MITRE ATT&CK® framework** mappings.

---

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API (`@google/genai`)

---

## 📂 Project Structure

The project uses a modular structure to promote maintainability and scalability.

```
/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx               # Main dashboard view
│   │   ├── SettingsView.tsx            # Settings and integrations view
│   │   ├── AuditLogView.tsx            # Audit log viewer
│   │   ├── AlertDetailsPanel.tsx       # Details panel for alerts
│   │   ├── VulnerabilityDetailsPanel.tsx # Details panel for vulnerabilities
│   │   ├── Header.tsx                  # Top navigation bar
│   │   ├── Sidebar.tsx                 # Main sidebar navigation
│   │   ├── MetricCard.tsx              # Reusable card for key metrics
│   │   └── ...                         # Other UI components
│   ├── services/
│   │   └── geminiService.ts            # Handles all communication with the Gemini API
│   ├── types.ts                        # Centralized TypeScript type definitions
│   ├── App.tsx                         # Root component, manages state and routing
│   └── index.tsx                       # Application entry point
├── index.html                          # Main HTML file
└── README.md                           # This file
```

---

## 🚀 Core Functionality Deep Dive

### AI-Powered Threat Analysis & Response

The core innovation of CyberGuard AI is its deep integration of AI throughout the incident lifecycle.

1.  **Contextual Data Aggregation**: When an alert is selected, the `Dashboard.tsx` component gathers all relevant data, including process details and MITRE ATT&CK context.
2.  **Specialized API Call**: This data is passed to the `getAlertExplanation` function in `geminiService.ts`.
3.  **Advanced Prompt Engineering**: A carefully crafted prompt instructs the `gemini-2.5-pro` model to act as a senior cybersecurity analyst. By defining a strict JSON schema, we ensure a predictable, structured response.
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

With a mature foundation, the next strategic steps for CyberGuard AI include:

-   **Full End-to-End Automation**: Evolve from demonstrating playbooks to a full SOAR-like capability where users can build, customize, and trigger their own automated response workflows.
-   **Natural Language Querying**: Implement a search bar that allows administrators to ask plain-English questions (e.g., `"Show me all PowerShell activity on domain controllers this week"`) and uses Gemini to translate them into data queries.
-   **Live Data & Agent Deployment**: Replace mock data with a real-time data pipeline from a lightweight endpoint agent or log aggregator.
-   **Activate Third-Party Integrations**: Move from simulated toggles to full API integrations with SIEMs (Splunk), ITSM tools (ServiceNow), and identity providers (Azure AD).
-   **Historical Reporting & Analytics**: Build a dedicated reporting section with dashboards and charts to visualize security trends over time and generate compliance summaries.
-   **Develop a Mobile Application**: Create a companion mobile app focused on high-priority alerts and immediate response actions, like endpoint isolation, for on-the-go administrators.