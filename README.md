# TelecomAI 2.0 — AI-Powered Telecom Operations & Customer Impact Intelligence Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-7%20Suites%20Passing-brightgreen.svg)](#testing--verification)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An end-to-end, full-stack **Operational Intelligence Platform** designed for mobile network operators. TelecomAI 2.0 bridges physical Radio Access Network (RAN) telemetry with subscriber experience, business revenue risk, prioritized incident intelligence, and enterprise IT Service Management (ITSM) ticketing.

> **Operational Scope Notice**: TelecomAI 2.0 operates as an AI-powered operational intelligence and decision-support system. It correlates multi-domain telemetry and produces actionable engineering playbooks and ITSM work orders; it does not directly actuate physical radio frequency transceivers or base station hardware without human-in-the-loop validation.

---

## 1. The Paradigm Shift: TelecomAI 1.0 ➔ TelecomAI 2.0

| Architectural Dimension | TelecomAI 1.0 (Proof-of-Concept) | TelecomAI 2.0 (Operational Intelligence Platform) |
| :--- | :--- | :--- |
| **Operational Loop** | Passive prediction: static dashboard reporting. | Closed-loop decision support: `Understand ➔ Correlate ➔ Prioritize ➔ Act`. |
| **Network & Customer Silos**| RAN anomalies and churn were scored in isolation. | **Cross-domain correlation**: maps degraded radio sectors directly to connected subscribers. |
| **Impact Assessment** | Generic outlier percentages. | **Quantified blast radius**: calculates affected subscribers, VIP accounts, and monthly revenue at risk (DZD). |
| **Incident Management** | Raw alarms per individual cell sector. | **Incident deduplication**: clusters multi-sector alarms into canonical incidents with dynamic P1–P4 SLA timers. |
| **Actionable Ops** | Static recommendation text snippets. | **6-Question AI operational assessment** + dual-track engineering & retention playbooks. |
| **Enterprise Hand-off** | None (manual operator inspection). | **Enterprise ITSM Connector** for automated work orders (ServiceNow, Jira Service Management, Webhooks). |
| **Demonstration Engine** | Static datasets. | **Interactive Scenario Simulation**: injects controlled regional degradation and resets on demand. |
| **Runtime Architecture** | Legacy split services with external Python dependencies. | **Single unified full-stack TypeScript platform** with native in-memory ML inference and sub-5ms latency. |

---

## 2. Flagship Demo Walkthrough: Saïda Backhaul Degradation (2–3 Minutes)

The platform is designed to be demonstrated end-to-end without modifying code. From the UI, operators and evaluators can follow or trigger the entire operational intelligence sequence:

```
[1] NORMAL BASELINE ──▶ [2] SIMULATE DEGRADATION ──▶ [3] CELL ANOMALY DETECTED ──▶ [4] TOPOLOGY IDENTIFIED
       │                             │                            │                         │
       ▼                             ▼                            ▼                         ▼
   All cells 97+             Microwave link fade          Isolation Forest          4 Cells / 2 Sites
   0 anomalies               +38% Latency, +12% Loss      Score: -0.18 (5-sigma)    Hub: SITE-SAI-001
       │                             │                            │                         │
       └─────────────────────────────┼────────────────────────────┴─────────────────────────┘
                                     ▼
[5] SUBSCRIBERS EXPOSED ──▶ [6] CXS DECREASE ──▶ [7] REVENUE AT RISK ──▶ [8] CANONICAL P1 INCIDENT
       │                           │                      │                         │
       ▼                           ▼                      ▼                         ▼
   1,284 Attached              CXS: 82.4 ➔ 48.1       12,500 DZD / Month        Deduplicates 7 Alarms
   237 High-Risk Churn         (-34.3 points)         12 Enterprise VIPs        Score: 88.5 / 100
       │                           │                      │                         │
       └─────────────────────────────┼──────────────────────┴─────────────────────────┘
                                     ▼
[9] AI OPERATIONAL BRIEF ──▶ [10] DUAL-TRACK PLAYBOOK ──▶ [11] SERVICENOW WORK ORDER
       │                              │                             │
       ▼                              ▼                             ▼
   6-Question Synthesis           Track A: 2600MHz Failover     INC-SNOW-89421 Dispatched
   Confidence: 84%                Track B: VIP Retention SMS    Bidirectional Status Synced
```

### How to Run the Demo from the UI:
1. **Launch Console**: Open `http://localhost:3000` (or the deployed preview URL).
2. **Observe Baseline**: Notice the **NOC LIVE CONSOLE** showing `STATE: NORMAL`, Health Score `97%`, 0 active anomalies.
3. **Trigger Simulation**: Click **"Run 3-Min Walkthrough"** on the 11-step interactive flow bar or trigger degradation via the **Simulation Controller**.
4. **Inspect Evidence & Priority**: Click **"Why P1 Priority?"** to inspect the mathematical formulation weighting blast radius, revenue exposure, network severity, and corporate VIP SLAs.
5. **Review AI Synthesis**: Open **Incident INC-0001 Detail** to review the 6-question structured brief and inspect the dual-track playbook.
6. **Inspect ITSM Dispatch**: View the live ServiceNow work order payload and observe bi-directional synchronization.
7. **Reset on Demand**: Click **"Reset Simulation"** to instantly return all radio sectors and incidents to nominal baseline.

---

## 3. Claim Verification Matrix

| Claim in Documentation | Implementation & Verification Evidence | Source File / Test |
| :--- | :--- | :--- |
| **"Sub-5ms Latency"** | Native in-memory ML scoring & spatial joins execute in 1.8–3.4 ms without database roundtrips. | `server/mlService.ts`, `server/telecom2/correlationEngine.ts` |
| **"Causal Blast Radius"** | Cross-domain spatial join correlates 1,284 registered subscriber IDs to degraded cell sectors. | `server/telecom2/telecomDataStore.ts` (Test 2) |
| **"Closed-Loop Decision Support"** | Automates end-to-end `Understand ➔ Correlate ➔ Prioritize ➔ Act` with human validation. | `InteractiveCausalChain.tsx`, `IncidentDetailModal.tsx` |
| **"3GPP Telemetry Baselines"** | Real-world distributions: 24–36ms nominal latency, PRB utilization, and CQI thresholds. | `docs/dataset.md`, `server/telecom2/telecomDataStore.ts` |
| **"Bidirectional Ticket Sandbox"** | REST connector dispatches eTOM/ITIL payloads to ServiceNow/Jira with status tracking. | `server/telecom2/itsmConnector.ts` (Test 5) |
| **"7 Automated Test Suites"** | 100% passing tests validating health score, correlation, CXS, incidents, ITSM, and ML models. | `npm test` (`server/telecom2/test_intelligence_loop.ts`) |

---

## 4. System Architecture & Operational Pipeline

```
                              TELECOM TELEMETRY & CRM DATA
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
          NETWORK INTELLIGENCE                           CUSTOMER EXPERIENCE (CX)
    • Regional Hierarchy (Wilaya ➔ Site ➔ Cell)   • 10k Subscriber Behavioral Cohorts
    • 3GPP Telemetry Baselines (Latency, Loss, PRB) • Customer Experience Score (CXS / CEI)
    • Unsupervised Anomaly Detection              • SHAP Attribution Vectors
                    │                                             │
                    └──────────────────────┬──────────────────────┘
                                           ▼
                                 AI CORRELATION ENGINE
                       • Spatial Topological Joining (Serving Cells)
                       • Causal Blast Radius Formulation
                       • Revenue at Risk (DZD) Exposure
                                           │
                                           ▼
                              INCIDENT INTELLIGENCE (P1–P4)
                       • Spatial Alarm Deduplication (e.g. INC-0001)
                       • Dynamic Priority Scoring & SLA Countdowns
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
        AI OPERATIONS ASSESSMENT                       ENTERPRISE ITSM CONNECTOR
   • 6-Question Operational Brief                 • ServiceNow Table API Payloads
   • Root Cause Technical Playbook                • Jira Service Management REST
   • Proactive Customer Care Playbook             • Bidirectional Ticket Sandbox
```

---

## 3. Implementation Status Across All 8 Milestones

- **Milestone 1 — Architecture + Data Contracts + Documentation** ✅
  - Formulated the closed-loop operational pipeline in [`docs/architecture.md`](docs/architecture.md).
  - Defined strict TypeScript contracts in [`server/telecom2/types.ts`](server/telecom2/types.ts) and [`docs/data-model.md`](docs/data-model.md).
  - Codified traceable mathematical formulations in [`docs/impact-model.md`](docs/impact-model.md).
- **Milestone 2 — Synthetic Telecom Data + Network Intelligence** ✅
  - Multi-tier Algerian topology (Saïda, Algiers, Oran, Tlemcen) with 3GPP telemetry baselines in [`server/telecom2/telecomDataStore.ts`](server/telecom2/telecomDataStore.ts).
  - Deterministic Cell Health Index (0–100) and multivariate anomaly severity tiers (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
  - Network overview and cell query APIs (`/api/network/*`).
- **Milestone 3 — Customer Experience + Network ➔ Customer Correlation** ✅
  - Topological subscriber-to-cell linkage (`attachedCellId`, `fallbackCellId`).
  - Dynamic Customer Experience Score (CXS / CEI) reflecting real-time radio degradation.
  - Granular SHAP feature attribution vectors explaining churn drivers.
  - Customer profile and experience APIs (`/api/customers/*`).
- **Milestone 4 — Impact + Incident Intelligence** ✅
  - Automated blast radius and revenue at risk (DZD) calculations.
  - Causal incident deduplication clustering multi-sector failures into canonical incidents.
  - Dynamic P1–P4 priority assignment with strict SLA countdowns.
- **Milestone 5 — AI Operations + Recommendations** ✅
  - End-to-end correlation engine in [`server/telecom2/correlationEngine.ts`](server/telecom2/correlationEngine.ts) via `POST /api/network/analyze`.
  - Structured 6-Question operational synthesis with multi-factor confidence rating.
  - Dual-track playbooks (radio engineering remediation + customer care retention).
- **Milestone 6 — Enterprise ITSM Connector** ✅
  - Extensible ITSM interface in [`server/telecom2/itsmConnector.ts`](server/telecom2/itsmConnector.ts).
  - Schema transformation for ServiceNow, Jira Service Management, and webhooks.
  - In-memory prototype registry with live ticket creation and status tracking (`/api/integrations/itsm/*`).
- **Milestone 7 — Frontend Integration** ✅
  - Modern React 19 NOC console with Executive Dashboard, Network Topology Explorer, Customer 360, and Incident Operations Command.
  - Live scenario simulation controller toolbar with one-click degradation trigger and instant baseline reset.
  - Prominent synthetic environment transparency banners.
- **Milestone 8 — Testing + Deployment + Documentation** ✅
  - 7 comprehensive automated test suites (`server/telecom2/test_intelligence_loop.ts`) passing via `npm test`.
  - Single-container production build with esbuild bundling and Vite asset compilation.
  - Aligned technical documentation and operational roadmaps in [`docs/`](docs/).

---

## 4. Actual Repository Structure

```
telecomai/
├── docs/                                # Technical specifications & methodology
│   ├── architecture.md                  # Operational pipeline design & data flow
│   ├── data-model.md                    # Entity contracts & schema specifications
│   ├── dataset.md                       # Telemetry bands & customer feature dictionaries
│   ├── impact-model.md                  # Mathematical equations (CXS, Blast Radius, Revenue)
│   ├── incident-model.md                # Severity matrix, P1-P4 priority & deduplication
│   ├── itsm-integration.md              # ServiceNow & Jira connector architecture
│   ├── limitations.md                   # Operational boundaries & synthetic data disclosure
│   ├── methodology.md                   # Supervised & unsupervised ML principles
│   ├── model-card.md                    # Concise model performance reference
│   ├── recommendation-methodology.md    # Dual-track technical & retention playbooks
│   └── roadmap.md                       # Milestone tracking and delivery status
│
├── server/                              # Backend services & in-memory ML engines
│   ├── mlService.ts                     # In-memory ML inference, SHAP, and benchmarks
│   └── telecom2/                        # TelecomAI 2.0 Operational Intelligence Core
│       ├── types.ts                     # TypeScript domain definitions
│       ├── telecomDataStore.ts          # Network topology, customer store & simulation
│       ├── correlationEngine.ts         # Multi-domain correlation & impact calculation
│       ├── itsmConnector.ts             # ServiceNow / Jira ticket integration connector
│       └── test_intelligence_loop.ts   # 7-suite end-to-end integration test runner
│
├── src/                                 # Modern React 19 Frontend Console
│   ├── components/                      # Reusable UI components & simulation controller
│   ├── pages/                           # Dashboard, Operations, Customers, Network, About
│   ├── data/                            # Client-side data references & topology schemas
│   ├── ml/mlEngine.ts                   # Frontend API client adapter
│   └── types.ts                         # Frontend TypeScript definitions
│
├── server.ts                            # Express application entry point & Vite middleware
├── package.json                         # Scripts & full-stack dependencies
├── render.yaml                          # Render deployment blueprint (single Node service)
├── vercel.json                          # Static frontend proxy configuration
├── vite.config.ts                       # Vite 6 bundler configuration
└── tsconfig.json                        # TypeScript configuration
```

---

## 5. Machine Learning Benchmarks & Model Evaluation

TelecomAI preserves rigorous model evaluation metrics from its benchmark validation:

### Customer Churn Benchmark (5-Fold Stratified Holdout)

| Model | Accuracy | Precision | Recall | F1-Score | Validation ROC-AUC | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Gradient Boosting** | **0.911** | **0.766** | **0.718** | **0.741** | **0.961** | **Selected Champion** |
| Random Forest | 0.910 | 0.789 | 0.673 | 0.726 | 0.958 | Candidate |
| Decision Tree | 0.900 | 0.739 | 0.670 | 0.703 | 0.924 | Baseline |
| Logistic Regression | 0.830 | 0.512 | 0.882 | 0.648 | 0.926 | Baseline |

### Unsupervised RAN Anomaly Detection
- **Model**: Isolation Forest (150 estimators, contamination = 0.037).
- **Paradigm**: Strictly unsupervised; evaluated against multi-metric radio threshold boundaries.
- **Latency / Loss / PRB Bounds**: Transport latency baseline 24–36 ms; critical degradation $> 65$ ms.

---

## 6. REST API Reference

### Core Operational Intelligence (TelecomAI 2.0)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/network/analyze` | Ingests network scope, correlates anomalies, computes blast radius, and outputs incident & recommendations. |
| `GET` | `/api/network/topology` | Returns Wilaya ➔ Site ➔ Cell geographic hierarchy. |
| `GET` | `/api/network/overview` | National network health score, active anomalies, and regional distribution. |
| `GET` | `/api/network/cells` | Query cells filtered by Wilaya, status, or site. |
| `GET` | `/api/network/cells/:id` | Detailed cell telemetry, baseline comparisons, and connected users. |
| `GET` | `/api/customers` | Query subscribers filtered by Wilaya, cell, or high-risk status. |
| `GET` | `/api/customers/:id` | Subscriber profile, contract, attached cell, and churn probability. |
| `GET` | `/api/customers/:id/experience`| Customer Experience Score (CXS) breakdown and SHAP risk factor vectors. |
| `GET` | `/api/impact/summary` | Aggregate customer blast radius and revenue at risk (DZD). |
| `GET` | `/api/incidents` | Active telecom incidents list with dynamic priority badges. |
| `GET` | `/api/incidents/:id` | Full incident payload with technical evidence and customer blast. |
| `POST` | `/api/incidents` | Create / ingest a new telecom incident. |
| `PATCH` | `/api/incidents/:id` | Update incident status (`NEW` ➔ `INVESTIGATING` ➔ `DISPATCHED` ➔ `RESOLVED`). |
| `GET` | `/api/ai/incidents/:id/analysis` | Structured 6-Question AI operations assessment with confidence score. |
| `POST` | `/api/integrations/itsm/ticket` | Dispatches incident work order to external ITSM system (ServiceNow / Jira). |
| `GET` | `/api/integrations/itsm/tickets`| Retrieves all dispatched ITSM tickets. |
| `POST` | `/api/simulation/degrade` | Triggers controlled Saïda microwave backhaul congestion event. |
| `POST` | `/api/simulation/reset` | Instantly resets all cells and incidents to nominal baseline. |

### Retained Machine Learning Endpoints (TelecomAI 1.0 Foundation)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Subsystem health check and engine readiness. |
| `GET` | `/api/churn/benchmark` | Multi-model validation metrics, confusion matrices, and ROC values. |
| `GET` | `/api/anomaly/specs` | Contamination rates and baseline 3GPP KPI thresholds. |
| `POST` | `/api/predict/churn` | Inference endpoint evaluating subscriber churn probability with SHAP factors. |
| `POST` | `/api/predict/anomaly` | Inference endpoint evaluating cell telemetry against outlier decision boundaries. |

---

## 7. Getting Started

### Prerequisites
- **Node.js**: v18.0 or higher
- **npm** or **bun**

### Installation
```bash
# Clone repository
git clone https://github.com/your-org/telecomai.git
cd telecomai

# Install dependencies
npm install
```

### Development
```bash
# Launches Express backend and Vite middleware on port 3000
npm run dev
```
Open your browser at `http://localhost:3000`.

### Running Tests
```bash
# Executes the 7-suite operational intelligence integration test runner
npm test
```

### Production Build
```bash
# Compiles React static assets and bundles the Node server via esbuild
npm run build

# Starts the standalone production server
npm start
```

---

## 8. Testing & Verification

TelecomAI 2.0 includes an automated, self-contained verification suite in `server/telecom2/test_intelligence_loop.ts`. Running `npm test` validates all 7 operational subsystems:

1. **Cell Health Score Calculation**: Verifies nominal (97/100) vs. degraded (25/100) scoring.
2. **AI Correlation Engine Loop**: Tests geographic scoping, +38% latency / +12% packet loss calculations, 1,284 affected subscriber count, 12,500 DZD revenue at risk, P1 priority assignment, and 0.84 AI confidence rating.
3. **Customer Experience Index (CXS) & SHAP**: Confirms individual subscriber exposure penalties and attribution vectors.
4. **Incident Intelligence & Lifecycle**: Validates incident creation, deduplication, and status transitions.
5. **ITSM Ticket Connector**: Confirms ServiceNow work order creation (`INC-SNOW-XXXXX`), SLA tracking, and audit notes.
6. **Simulation Engine Controls**: Tests the controlled degradation trigger and instant baseline reset.
7. **ML Model Performance Retention**: Verifies that documented ROC-AUC (0.961) and benchmark metrics remain preserved.

---

## 9. Deployment

TelecomAI 2.0 is packaged as a **single, self-contained full-stack container application**. No external Python runtime or multi-service orchestration is required.

### Deployment on Render
A pre-configured [`render.yaml`](render.yaml) blueprint is included:
1. Link your repository in Render (**New ➔ Blueprint**).
2. Render provisions a single web service running:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Port**: `3000`

### Deployment with Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/server.cjs"]
```

---

## 10. Scientific Honesty & Operational Boundaries

1. **Synthetic Environment Disclosure**:
   - All network telemetry and customer records are generated synthetically using realistic 3GPP and mobile subscriber distributions.
   - High validation metrics (e.g. ROC-AUC 0.961) reflect algorithmic consistency within this calibrated environment, not empirical measurement on live commercial operator networks.
2. **Advisory Decision Support vs. Closed-Loop Actuation**:
   - TelecomAI 2.0 formulates **AI Recommended Actions** and dispatches structured work orders to human engineering and care teams.
   - It **does not directly actuate** physical radio hardware, beam steering, or BGP route flapping, adhering to telecommunications governance mandates.
3. **External System Integration**:
   - The included ITSM connector features an in-memory prototype registry for demonstration and testing. Live enterprise production environments connect via standard REST credentials (ServiceNow Table API / Jira Service Desk REST).

---

## 11. License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
