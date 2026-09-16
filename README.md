# TelecomAI 2.0 — AI-Powered Telecom Network & Customer Impact Intelligence Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-8%20Suites%20Passing-brightgreen.svg)](#8-testing--verification)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

TelecomAI 2.0 correlates network telemetry, customer experience, and business impact to detect operational incidents, prioritize their severity, explain their impact, and recommend actionable responses.

> **Operational Scope Notice**: TelecomAI 2.0 operates as an operational intelligence and decision-support platform for mobile network operations. It correlates multi-domain telemetry and generates actionable engineering playbooks and ITSM work orders; it does not directly actuate physical radio frequency transceivers or base station hardware without human-in-the-loop validation.

---

## 1. Architectural Taxonomy: Clarifying "AI" Across the Platform

To maintain strict technical accuracy, the intelligence capabilities of TelecomAI 2.0 are categorized into three distinct architectural layers:

```
TelecomAI Intelligence Architecture
├── 1. Machine Learning (Statistical & Algorithmic Models)
│   ├── Churn Prediction: Supervised Gradient Boosting Classifier (ROC-AUC 0.961 on synthetic benchmark)
│   ├── Feature Attribution: SHAP TreeExplainer local attribution vectors
│   └── Anomaly Detection: Unsupervised Isolation Forest (multi-dimensional telemetry vectors)
│
├── 2. Operational Intelligence (Deterministic Correlation & Business Math)
│   ├── Network-to-Customer Blast-Radius Correlation: Spatial topological join of registered subscribers to degraded sectors
│   ├── Customer Experience Index (CXS / CEI): Multi-factor QoS degradation formulation
│   ├── Estimated Revenue at Risk: Synthetic exposure calculated from churn probability, ARPU, and degraded tenure
│   ├── Dynamic Priority Scoring: Deterministic multi-factor formulation (P1–P4 SLA countdowns)
│   └── Spatial Alarm Deduplication: Suppression of multi-sector telemetry alarm floods into canonical incidents
│
└── 3. Decision Support (Structured Operational Synthesis & Playbooks)
    ├── Operational Assessment: Structured 6-question diagnostic synthesis grounded in verified evidence
    ├── Network Engineering Playbook: Automated carrier failover & tilt recommendations
    └── Customer Care Playbook: Proactive retention bonus voucher & targeted subscriber notifications
```

---

## 2. The Paradigm Shift: TelecomAI 1.0 ➔ TelecomAI 2.0

| Architectural Dimension | TelecomAI 1.0 (Proof-of-Concept) | TelecomAI 2.0 (Operational Intelligence Platform) |
| :--- | :--- | :--- |
| **Operational Loop** | Passive prediction: static dashboard reporting. | Closed-loop decision support: `Understand ➔ Correlate ➔ Prioritize ➔ Act`. |
| **Network & Customer Silos**| RAN anomalies and churn scored in isolation. | **Cross-domain correlation**: maps degraded radio sectors directly to connected subscribers. |
| **Impact Assessment** | Generic outlier percentages. | **Quantified blast radius**: calculates affected subscribers, VIP accounts, and synthetic estimated revenue exposure (DZD). |
| **Incident Management** | Raw alarms per individual cell sector. | **Incident deduplication**: clusters multi-sector alarms into canonical incidents with dynamic P1–P4 SLA timers. |
| **Actionable Ops** | Static recommendation text snippets. | **6-Question operational assessment** + dual-track engineering & retention playbooks. |
| **Enterprise Hand-off** | None (manual operator inspection). | **ITSM Integration Prototype** generating ServiceNow-compatible and Jira-compatible work-order payloads. |
| **Demonstration Engine** | Static datasets. | **Multi-Scenario Simulation**: injects backhaul congestion, cell congestion, or site outages and resets on demand. |
| **Runtime Architecture** | Legacy split services with external Python dependencies. | **Single unified full-stack TypeScript platform** with in-memory processing. |

---

## 3. Flagship Demo Walkthrough: Saïda Backhaul Degradation (2–3 Minutes)

The platform is designed to be demonstrated end-to-end without external dependencies. From the UI, operators and evaluators can follow or trigger the entire operational intelligence sequence:

```
[1] NORMAL BASELINE ──▶ [2] SIMULATE DEGRADATION ──▶ [3] ANOMALY DETECTED ──▶ [4] TOPOLOGY IDENTIFIED
       │                             │                          │                        │
       ▼                             ▼                          ▼                        ▼
   All cells 97+             Microwave link fade        Isolation Forest         4 Cells / 2 Sites
   0 anomalies               +38% Latency, +12% Loss    Score: -0.18 (5-sigma)   Hub: SITE-SAI-001
       │                             │                          │                        │
       └─────────────────────────────┼──────────────────────────┴────────────────────────┘
                                     ▼
[5] SUBSCRIBERS EXPOSED ──▶ [6] CXS DECREASE ──▶ [7] ESTIMATED REVENUE RISK ──▶ [8] CANONICAL P1 INCIDENT
       │                           │                          │                          │
       ▼                           ▼                          ▼                          ▼
   1,284 Attached              CXS: 82.4 ➔ 48.1           12,500 DZD Exposure        Deduplicates 7 Alarms
   187 High-Risk Churn         (-34.3 points)             12 Enterprise VIPs         Score: 88.5 / 100
       │                           │                          │                          │
       └─────────────────────────────┼──────────────────────────┴────────────────────────┘
                                     ▼
[9] OPERATIONAL ASSESSMENT ──▶ [10] DUAL-TRACK PLAYBOOK ──▶ [11] ITSM WORK ORDER PROTOTYPE
       │                                │                                │
       ▼                                ▼                                ▼
   Structured 6-Question Brief      Track A: 2600MHz Failover        ServiceNow-Compatible Payload
   Confidence: 84%                  Track B: VIP Retention SMS       INC-SNOW-89421 Dispatched
```

### How to Run the Demo from the UI:
1. **Launch Console**: Open `http://localhost:3000` (or the deployed preview URL).
2. **Observe Baseline**: Notice the **NOC LIVE CONSOLE** showing `STATE: NORMAL`, Health Score `97%`, 0 active anomalies.
3. **Trigger Simulation**: Click **"Run 3-Min Walkthrough"** on the interactive flow bar or select a scenario (e.g., *Saïda Backhaul Congestion*) via the **Simulation Controller**.
4. **Inspect Evidence & Priority**: Click **"Why P1?"** to inspect the mathematical formulation weighting blast radius, revenue exposure, network severity, and corporate VIP SLAs.
5. **Review Operational Assessment**: Open **Incident INC-0001 Detail** to review the structured 6-question diagnostic brief and inspect the dual-track playbook.
6. **Inspect ITSM Dispatch**: View the ServiceNow-compatible work-order payload in the ITSM Integration Prototype sandbox.
7. **Reset on Demand**: Click **"Reset Simulation"** to instantly return all radio sectors and incidents to nominal baseline.

---

## 4. Claim Verification Matrix

| Claim in Documentation | Implementation & Verification Evidence | Source File / Test |
| :--- | :--- | :--- |
| **In-Memory Processing Latency** | Measured in-memory processing latency: ~1.8–3.4 ms in the local synthetic benchmark without database I/O. | `server/mlService.ts`, `server/telecom2/correlationEngine.ts` |
| **Network-to-Customer Blast-Radius Correlation** | Cross-domain spatial join correlates 1,284 registered subscriber IDs to degraded cell sectors. | `server/telecom2/telecomDataStore.ts` (Test 2) |
| **Closed-Loop Decision Support** | Automates end-to-end `Understand ➔ Correlate ➔ Prioritize ➔ Act` with human validation. | `InteractiveCausalChain.tsx`, `IncidentDetailModal.tsx` |
| **3GPP-Informed Synthetic Telemetry Baselines** | Standard 3GPP operational distributions: 24–36ms nominal latency, PRB utilization, and CQI thresholds. | `docs/dataset.md`, `server/telecom2/telecomDataStore.ts` |
| **ITSM Integration Prototype** | REST connector dispatches ServiceNow-compatible and Jira-compatible work-order payloads with SLA tracking. | `server/telecom2/itsmConnector.ts` (Test 5) |
| **8 Automated Test Suites** | 100% passing tests validating health score, correlation, CXS, incidents, ITSM, simulation, and ML models. | `npm test` (`server/telecom2/test_intelligence_loop.ts`) |

---

## 5. TelecomAI 1.0 ML Foundation — Retained in 2.0

TelecomAI 2.0 retains the verified machine learning models originally developed and evaluated under TelecomAI 1.0, and integrates them into its real-time operational pipeline:

### Customer Churn Benchmark (5-Fold Stratified Holdout on Synthetic Dataset)

| Model | Accuracy | Precision | Recall | F1-Score | Validation ROC-AUC | Status in Platform |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Gradient Boosting** | **0.911** | **0.766** | **0.718** | **0.741** | **0.961** | **Champion Churn Classifier** |
| Random Forest | 0.910 | 0.789 | 0.673 | 0.726 | 0.958 | Benchmark Candidate |
| Decision Tree | 0.900 | 0.739 | 0.670 | 0.703 | 0.924 | Baseline |
| Logistic Regression | 0.830 | 0.512 | 0.882 | 0.648 | 0.926 | Baseline |

> **Context Note**: The 0.961 ROC-AUC benchmark applies specifically to the offline supervised subscriber churn classifier on the calibrated synthetic dataset. It does not measure the overall 2.0 operational correlation system.

### Unsupervised RAN Anomaly Detection
- **Model**: Isolation Forest (150 estimators, contamination rate = 0.037).
- **Paradigm**: Unsupervised partitioning trees isolating anomalous multi-dimensional telemetry vectors.
- **Telemetry Bounds**: Transport latency baseline 24–36 ms; critical degradation $> 65$ ms.

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
| `GET` | `/api/impact/summary` | Aggregate customer blast radius and estimated revenue at risk (DZD). |
| `GET` | `/api/incidents` | Active telecom incidents list with dynamic priority badges. |
| `GET` | `/api/incidents/:id` | Full incident payload with technical evidence and customer blast. |
| `POST` | `/api/incidents` | Create / ingest a new telecom incident. |
| `PATCH` | `/api/incidents/:id` | Update incident status (`NEW` ➔ `INVESTIGATING` ➔ `DISPATCHED` ➔ `RESOLVED`). |
| `GET` | `/api/ai/incidents/:id/analysis` | Structured 6-Question operational assessment with confidence score. |
| `POST` | `/api/integrations/itsm/ticket` | Dispatches incident work order to ITSM Integration Prototype (ServiceNow / Jira). |
| `GET` | `/api/integrations/itsm/tickets`| Retrieves all dispatched prototype ITSM tickets. |
| `POST` | `/api/simulation/degrade` | Triggers controlled degradation scenario (Backhaul, Congestion, or Outage). |
| `POST` | `/api/simulation/scenario` | Multi-scenario simulator endpoint with severity and Wilaya parameters. |
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
git clone https://github.com/drissou/telecomai.git
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
# Executes the 8-suite operational intelligence integration test runner
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

TelecomAI 2.0 includes an automated verification suite in `server/telecom2/test_intelligence_loop.ts`. Running `npm test` validates all key operational subsystems:

1. **Cell Health Score Calculation**: Verifies nominal (97/100) vs. degraded (25/100) scoring.
2. **Correlation Engine Loop**: Tests geographic scoping, +38% latency / +12% packet loss calculations, 1,284 affected subscriber count, 12,500 DZD revenue exposure, P1 priority assignment, and 0.84 confidence rating.
3. **Customer Experience Index (CXS) & SHAP**: Confirms individual subscriber exposure penalties and attribution vectors.
4. **Incident Intelligence & Lifecycle**: Validates incident creation, deduplication, and status transitions.
5. **ITSM Integration Prototype**: Confirms ServiceNow-compatible work-order creation (`INC-SNOW-XXXXX`), SLA tracking, and audit notes.
6. **Simulation Engine Controls**: Tests the controlled degradation trigger and instant baseline reset across scenarios.
7. **Complete Operational Intelligence Loop**: Validates the end-to-end chain from simulation ➔ anomaly ➔ correlation ➔ customer impact ➔ business impact ➔ incident ➔ priority ➔ assessment ➔ recommendation ➔ ITSM dispatch.
8. **ML Model Performance Retention**: Verifies that documented ROC-AUC (0.961) and benchmark metrics remain preserved.

---

## 9. Limitations

To ensure absolute transparency for evaluators, recruiters, and engineering teams:

- **Synthetic Data**: All telecom network telemetry, base station coordinates, subscriber behavioral attributes, and usage records are generated synthetically using 3GPP-informed statistical distributions. No live operator confidential records are contained in this repository.
- **No Direct Hardware Actuation**: The platform functions exclusively as an operational intelligence and decision-support system. It generates actionable recommendations and work-order payloads, but does not directly control physical radio access hardware, antenna tilt motors, or core IP routing equipment.
- **Estimated Revenue Exposure**: Figures labeled "Estimated Revenue at Risk" (e.g., 12,500 DZD) represent synthetic prototype estimations calculated from simulated subscriber ARPU and churn probability. They do not represent actual financial ledgers.
- **Methodology-Specific Priority**: Priority scoring (P1–P4) reflects custom operational criteria combining technical severity, blast radius, and revenue risk, rather than standardized operator contractual SLA definitions.
- **Prototype ITSM Integration**: The ServiceNow and Jira connectors interface with an in-memory prototype registry and format standard eTOM/ITIL payloads; they are not connected to commercial enterprise production tenants.
- **Human-in-the-Loop Validation**: All remediation actions and ITSM dispatches are intended for advisory review by network operations engineers before field execution.

---

## 10. License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
