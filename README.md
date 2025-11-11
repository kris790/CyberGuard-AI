# CyberGuard AI - Intelligent Cybersecurity Dashboard

![CyberGuard AI Dashboard Screenshot](https://storage.googleapis.com/aistudio-hosting/project-images/cyberguard-ai-screenshot.png)

CyberGuard AI is a modern, proof-of-concept cybersecurity dashboard designed for enterprise-grade threat detection and analysis. It leverages the power of Google's Gemini 2.5 Pro model to provide IT administrators and security analysts with immediate, context-aware insights into security alerts, significantly reducing cognitive load and investigation time.

This application demonstrates a focused, AI-first approach to endpoint security by transforming raw alert data into actionable intelligence.

---

## ✨ Key Features

- **AI-Assisted Triage**: Utilizes the Gemini 2.5 Pro API to generate plain-English summaries, risk scores, and actionable recommendations for security alerts.
- **Context-Rich Alerting**: Enriches alerts with critical context, including parent process information and **MITRE ATT&CK® framework** mappings, providing a deeper understanding of threat actor behavior.
- **Interactive Vulnerability Management**: A two-pane interface allows for efficient browsing and detailed analysis of critical and high-severity vulnerabilities, complete with remediation steps and CVE links.
- **At-a-Glance Security Metrics**: A clean dashboard provides key performance indicators for endpoint protection and threat detection.
- **Responsive & Modern UI**: Built with Tailwind CSS for a professional, intuitive, and responsive user experience that works across different screen sizes.

---

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Charts/Visualizations**: Recharts (for potential future use)

---

## 📂 Project Structure

The project is organized into a modular structure to promote maintainability and scalability.

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx         # Main dashboard, orchestrates all widgets and views
│   │   ├── Header.tsx            # Top navigation bar
│   │   ├── Sidebar.tsx           # Main sidebar navigation
│   │   ├── VulnerabilityList.tsx # Component for displaying vulnerability table
│   │   ├── MetricCard.tsx        # Reusable card for key metrics
│   │   └── IconComponents.tsx    # SVG icons
│   ├── services/
│   │   └── geminiService.ts      # Handles all communication with the Gemini API
│   ├── types.ts                  # Centralized TypeScript type definitions
│   ├── App.tsx                   # Root React component, sets up layout
│   └── index.tsx                 # Application entry point
├── index.html                    # Main HTML file
└── README.md                     # This file
```

---

## 🚀 Core Functionality Deep Dive

### AI-Assisted Triage with Gemini

The core innovation of CyberGuard AI is its intelligent alert analysis. When a user selects an alert from the list, the following process occurs:

1.  **Contextual Data Aggregation**: The `Dashboard.tsx` component gathers all relevant data for the selected alert, including `processName`, `parentProcessName`, and crucial `mitreTactic` and `mitreTechnique` information.
2.  **Specialized API Call**: This data is passed to the `getAlertExplanation` function in `geminiService.ts`.
3.  **Prompt Engineering**: A carefully crafted prompt instructs the `gemini-2.5-pro` model to act as a cybersecurity expert. The prompt specifies that the output must be a JSON object conforming to a predefined schema.
4.  **Structured JSON Response**: By setting `responseMimeType: "application/json"` and providing a `responseSchema`, we ensure that the Gemini API returns a predictable, structured object containing:
    -   `summary`: A concise, easy-to-understand explanation of the threat.
    -   `riskScore`: A numerical score from 1-10.
    -   `recommendation`: A single, clear next step for the administrator.
5.  **Dynamic UI Update**: The `Dashboard.tsx` component receives this structured data and updates the "AI-Assisted Triage" panel, displaying the analysis and a color-coded risk meter.

This workflow transforms a raw, potentially cryptic security alert into a clear, prioritized, and actionable intelligence brief in seconds.

### Vulnerability Management

The dashboard also includes a robust vulnerability management section:

-   **Prioritized View**: The main list is pre-filtered to show only 'Critical' and 'High' severity vulnerabilities, allowing administrators to focus on what matters most.
-   **Detailed Analysis Panel**: Clicking on a vulnerability opens a side panel with comprehensive details, including:
    -   The specific asset affected.
    -   A clear description of the vulnerability.
    -   Actionable remediation steps.
    -   A direct link to the official CVE entry on the NIST website for further research.

---

## 🔮 Future Improvements

While this project is a strong proof-of-concept, future development could include:

-   **Live Data Integration**: Replace mock data with real-time data streams from endpoint agents or a SIEM.
-   **User Authentication & RBAC**: Implement user roles and permissions.
-   **Historical Analysis & Reporting**: Add charting and reporting features to track trends over time.
-   **Automated Response Actions**: Allow users to execute remediation actions (e.g., "Isolate Endpoint") directly from the UI by integrating with an endpoint management platform.
