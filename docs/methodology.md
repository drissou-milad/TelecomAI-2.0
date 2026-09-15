# TelecomAI 2.0 — Machine Learning Methodology & Operational Intelligence Framework

## 1. Executive Summary

TelecomAI 2.0 bridges machine learning algorithms with closed-loop network operations:
1. **Supervised Customer Churn Modeling**: Rigorous 4-algorithm benchmark with Gradient Boosting champion.
2. **Explainable AI (SHAP) & CX Attribution**: Decomposing churn risk into actionable behavioral and radio-exposure factors.
3. **Unsupervised Radio Anomaly Detection**: Isolation Forest thresholding and multivariate 3GPP telemetry monitoring.
4. **Autonomous Operational Intelligence Loop**: Real-time correlation linking radio telemetry degradation to subscriber impact, business revenue risk, P1-P4 incidents, and ITSM ticketing.

---

## 2. Supervised Churn Modeling Pipeline

### 2.1 Problem Formulation
Customer churn in mobile telecommunications is formulated as a binary classification problem:
$$y \in \{0, 1\}$$
where $y = 1$ denotes a subscriber terminating their contract or ceasing recharge activity within the subsequent 30-day billing cycle.

### 2.2 Model Benchmark & Champion Selection
Four algorithms were evaluated under identical 5-fold stratified cross-validation on a 10,000-subscriber synthetic benchmark (20% holdout):

| Model | Validation ROC-AUC | Precision | Recall | F1-Score | Training Latency | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Gradient Boosting Classifier** | **0.961** | **0.766** | **0.718** | **0.741** | 2,288 ms | **Selected Champion** |
| **Random Forest Classifier** | 0.958 | 0.789 | 0.673 | 0.726 | 726 ms | Candidate |
| **Decision Tree Classifier** | 0.924 | 0.739 | 0.670 | 0.703 | 27 ms | Baseline |
| **Logistic Regression (L2 regularized)** | 0.926 | 0.512 | 0.882 | 0.648 | 15 ms | Baseline |

> **Champion Selection Rationale**: While Random Forest achieved marginally higher precision, Gradient Boosting delivered superior balanced recall (0.718 vs 0.673) and the highest validation ROC-AUC (0.961). In telecommunications retention operations, false negatives (unidentified churning customers) represent direct, irreversible revenue loss.

### 2.3 Explainability Framework: SHAP Attribution
The model exposes feature impact vectors derived from cooperative game theory (Shapley values):
- **Global Feature Hierarchy**:
  1. Subscriber Tenure (months) — 29.8% importance
  2. Customer Service Complaints (60d) — 23.7% importance
  3. Month-over-Month Usage Decline (%) — 16.2% importance
  4. Prepaid Contract Type — 9.8% importance
  5. Data Usage Volume (GB) — 8.5% importance
- **Local Feature Attributions**: Each subscriber evaluation produces dynamic attribution bars quantifying how specific behaviors increase or decrease churn probability relative to base expectation.

---

## 3. Unsupervised Cellular Anomaly Detection

### 3.1 Unsupervised Paradigm
- **Algorithm**: Isolation Forest with 150 estimators, contamination rate $\approx 3.7\%$.
- **Training Principle**: The model is trained in a strictly unsupervised manner without historical fault labels. Radio telemetry samples (transport latency, packet loss, active UEs, throughput, carrier availability) are partitioned using random axis-aligned splits; anomalies isolate at shallower tree depths.
- **Calibration**: Decision boundaries are calibrated against 3GPP operational tolerances to distinguish legitimate peak events (e.g. holiday traffic surges) from hardware and transport faults.

### 3.2 Monitored Telemetry KPI Bands
1. **Transport Round-Trip Latency ($ms$)**: Baseline 24–36 ms; Warning $> 50$ ms; Anomaly $> 65$ ms.
2. **Packet Drop Rate ($\%$)**: Nominal $< 0.4\%$; Warning $> 1.0\%$; Anomaly $> 2.0\%$.
3. **Connected UEs & PRB Utilization**: Evaluated for radio interface congestion.
4. **Carrier Availability ($\%$)**: SLA benchmark $99.8\%$; Breach $< 95.0\%$.

---

## 4. The TelecomAI 2.0 Operational Intelligence Loop

TelecomAI 2.0 advances beyond static predictions by implementing a real-time, closed-loop causal pipeline:

```
[Cell Telemetry] ──> [Anomaly Detection] ──> [Spatial Correlation]
                                                    │
                                                    ▼
[Enterprise ITSM] <── [AI Operations Playbook] <── [Incident Prioritization (P1-P4)]
```

1. **Continuous Telemetry Monitoring**: Real-time evaluation of cell sector health indices.
2. **Topological Correlation**: Spatial join linking degraded radio carriers to attached subscribers.
3. **Impact Quantification**: Dynamically computes subscriber blast radius and monthly revenue exposure.
4. **Incident Clustering & Prioritization**: Aggregates co-located sector alarms into deduplicated P1–P4 incidents with SLA timers.
5. **6-Question AI Assessment**: Produces structured root-cause synthesis with confidence scoring.
6. **Enterprise ITSM Connector**: Transforms incident context into standardized work order payloads for ServiceNow and Jira Service Management.

---

## 5. Runtime Architecture: Native In-Memory TypeScript Service

To achieve high-performance, deterministic execution without external Python dependencies in deployment, the production model inference engine, SHAP attribution logic, and correlation algorithms are implemented natively in TypeScript (`server/mlService.ts` and `server/telecom2/correlationEngine.ts`). This architecture guarantees sub-5ms API response times and zero cold-start latency.
