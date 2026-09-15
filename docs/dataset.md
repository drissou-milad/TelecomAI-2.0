# TelecomAI 2.0 — Dataset Architecture & Telemetry Engineering

## 1. Overview

TelecomAI 2.0 operates on a fully deterministic synthetic telecom environment, providing unified data models for radio access network (RAN) telemetry and subscriber behavior. The dataset generation logic, behavioral distributions, and network baselines are codified directly within the TypeScript data engine (`server/telecom2/telecomDataStore.ts` and `server/mlService.ts`), ensuring zero-dependency, reproducible execution.

---

## 2. Customer Churn & Experience Dataset

### 2.1 Dataset Specifications
- **Monitored Subscribers**: 10,000 synthetic subscriber records across regional footprints.
- **Base Churn Rate**: $\approx 17.8\%$ (calibrated to realistic emerging/prepaid-dominant mobile market dynamics).
- **Features**: 8 behavioral attributes + calculated interaction metrics + topological network attachment.

### 2.2 Feature Dictionary

| Feature Name | Type | Description | Range / Categories |
| :--- | :--- | :--- | :--- |
| `customerId` | String | Unique subscriber identifier | `C10001` - `C20000` / `CUST-SAI-001` |
| `monthlySpendDZD` | Float | Average monthly billing expenditure in Algerian Dinars | 300 - 9,500 DZD |
| `dataUsageGB` | Float | Monthly mobile broadband data consumption | 0.5 - 120.0 GB |
| `callsCount` | Integer | Outbound cellular call count per month | 5 - 350 calls |
| `complaints` | Integer | Customer service complaints logged in past 60 days | 0 - 6 |
| `rechargeFrequency`| Integer | Balance replenishment events per billing period | 1 - 12 recharges |
| `subscription` | String | Account billing contract category | `Prepaid`, `Postpaid` |
| `tenureMonths` | Integer | Continuous subscriber account tenure | 1 - 72 months |
| `usageDropPct` | Float | Month-over-month usage decrease percentage | 0.0% - 90.0% |
| `attachedCellId` | String | Primary serving radio cell sector | e.g., `CELL-SAI-001` |
| `fallbackCellId` | String | Adjacent handover candidate sector | e.g., `CELL-SAI-002` |
| `cxs` | Integer | Customer Experience Score (0–100 composite index) | 0 - 100 |

### 2.3 Customer Experience Score (CXS / CEI) Formulation
The Customer Experience Score synthesizes 4 distinct operational pillars:
1. **Network QoE Factor (40%)**: Ratio of current serving cell latency and packet loss to baseline.
2. **Service & Care Factor (25%)**: Penalty proportional to recent complaint volume.
3. **Usage Stability Factor (20%)**: Month-over-month data/voice drop indicators.
4. **Tenure Loyalty Factor (15%)**: Long-term tenure buffering against transient dissatisfaction.

---

## 3. Network Radio Access Telemetry Dataset

### 3.1 Dataset Specifications
- **Hierarchical Structure**: 4 Wilayas (**Saïda**, **Algiers**, **Oran**, **Tlemcen**), hosting base station sites and multi-sector directional cell carriers.
- **Monitored Radio Sectors**: Directional 4G-LTE and 5G-NR cell carriers with azimuth alignments (0°, 120°, 240°).
- **Nominal Operating Baselines**: Calibrated 3GPP performance thresholds.

### 3.2 Monitored Key Performance Indicators (KPIs)

| Metric | Nominal Baseline | Anomaly Signature (Degradation Event) |
| :--- | :--- | :--- |
| `latencyMs` | 24 - 36 ms | Surge $> 65$ ms (+38% to +80% over baseline) |
| `packetLossPct` | 0.2% - 0.4% | Severe increase $> 2.0\%$ (+12% to +25% delta) |
| `connectedUsers` | 150 - 450 active UEs | Overload $> 600$ UEs or abnormal drop |
| `trafficMbps` | 120 - 320 Mbps | Throughput degradation below provisioned capacity |
| `availabilityPct` | 99.8% $\pm 0.1\%$ | Carrier availability drop $< 95.0\%$ |
| `prbUtilizationPct`| 35% - 55% | PRB saturation $> 85\%$ |

---

## 4. Controlled Scenario Simulation: Saïda High-Plateaux Event

TelecomAI 2.0 includes a deterministic, reproducible degradation scenario:
- **Wilaya**: Saïda (`DZ-20`)
- **Infrastructure Impact**: 3 Sites, 7 Cells (e.g., `SITE-SAI-01`, `CELL-SAI-001`, `CELL-SAI-002`, `CELL-SAI-003`).
- **Telemetry Deviation**: Latency surges by $+38\%$, packet loss increases by $+12\%$.
- **Subscriber Exposure**: 1,284 affected subscribers, with 237 elevated to high churn risk.
- **Revenue at Risk**: 12,500 DZD/month directly threatened.
- **Priority Tier**: Auto-classified as **P1-CRITICAL** with 60-minute SLA countdown.
- **Reset Capability**: Instant restoration to nominal baseline via `/api/simulation/reset`.

---

## 5. Scientific Transparency & Synthetic Data Disclosure

> **Operational Notice**:
> - All radio telemetry and customer behavior data in this repository is generated synthetically to provide a safe, reproducible operational intelligence environment.
> - High model validation accuracy (e.g., ROC-AUC 0.961 on Gradient Boosting) demonstrates internal algorithmic consistency and effective feature synthesis, not empirical measurement on live operator networks.
> - In live commercial deployments, data feeds must be connected via 3GPP Northbound PM/FM interfaces (e.g., Kafka / REST / SNMP) and BSS billing CDR collectors.
