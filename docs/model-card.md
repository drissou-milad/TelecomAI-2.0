# TelecomAI 2.0 — Model Card

Two machine learning models power the core analytical layer of TelecomAI 2.0. Full methodology and operational boundaries are detailed in [`docs/methodology.md`](./methodology.md) and [`docs/limitations.md`](./limitations.md).

---

## 1. Customer Churn Prediction & CX Attribution

| Property | Value |
| :--- | :--- |
| **Task** | Binary classification — evaluate subscriber probability of churning within the subsequent 30-day billing cycle |
| **Model** | Gradient Boosting Classifier, selected as champion over Random Forest, Decision Tree, and Logistic Regression |
| **Selection Criterion** | Highest validation ROC-AUC (0.961) with balanced recall (0.718) and F1-score (0.741) |
| **Input Features** | Monthly spend (DZD), data usage (GB), call count, complaints (60d), recharge frequency, tenure (months), usage decline rate (%), contract type (prepaid/postpaid), cost-per-GB ratio |
| **Output** | Churn probability (0–100%), risk tier (`LOW` / `MEDIUM` / `HIGH`), top contributing risk factors, recommended retention playbook |
| **Explainability** | SHAP (`TreeExplainer`) feature attributions quantifying marginal impact on log-odds shift from baseline |
| **Runtime Implementation** | High-performance native TypeScript inference service in `server/mlService.ts` |
| **Benchmark Dataset** | 10,000 synthetic subscriber records across prepaid and postpaid cohorts |
| **Test Partition** | 2,000 held-out samples (20% stratified holdout) |

### Benchmark Evaluation (Held-Out Test Set)

| Model | Accuracy | Precision | Recall | F1 | ROC-AUC | Training Time |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Gradient Boosting (Champion)** | **0.911** | 0.766 | 0.718 | 0.741 | **0.961** | 2,288 ms |
| Random Forest | 0.910 | 0.789 | 0.673 | 0.726 | 0.958 | 726 ms |
| Decision Tree | 0.900 | 0.739 | 0.670 | 0.703 | 0.924 | 27 ms |
| Logistic Regression (Baseline) | 0.830 | 0.512 | 0.882 | 0.648 | 0.926 | 15 ms |

### Global Feature Importance
1. Subscriber tenure (months) — 29.8%
2. Customer service complaints (60d) — 23.7%
3. Month-over-month usage decline rate (%) — 16.2%
4. Prepaid contract type — 9.8%
5. Monthly broadband data usage (GB) — 8.5%

---

## 2. Unsupervised Radio Access Network (RAN) Anomaly Detection

| Property | Value |
| :--- | :--- |
| **Task** | Unsupervised multivariate outlier detection on cellular radio access network telemetry |
| **Model** | Isolation Forest (150 estimators, contamination = 0.037) |
| **Learning Paradigm** | Strictly unsupervised — trained without fault labels |
| **Input Features** | Transport round-trip latency (ms), packet error loss rate (%), connected UEs, throughput (Mbps), availability (%) |
| **Output** | Anomaly status (`normal`, `warning`, `anomaly`), anomaly score (0–100), confidence percentage, root cause diagnosis |
| **Runtime Implementation** | Native multi-tier statistical evaluation in `server/mlService.ts` and `server/telecom2/telecomDataStore.ts` |

---

## 3. Operational Intelligence & Incident Correlation (TelecomAI 2.0)

Beyond individual model scoring, TelecomAI 2.0 integrates an **Autonomous Operational Loop**:
- Joins degraded radio cells to connected subscribers (`attachedCellId`).
- Calculates the dynamic **Customer Experience Score (CXS)** reflecting real-time radio degradation.
- Quantifies customer blast radius and monthly recurring revenue at risk (DZD).
- Clusters related cell anomalies into deduplicated P1–P4 incidents with SLA timers.
- Formulates dual-track engineering and customer care playbooks dispatched to enterprise ITSM systems.
