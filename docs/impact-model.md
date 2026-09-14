# TelecomAI 2.0 — Impact Calculation Methodology

Every metric in TelecomAI 2.0 is mathematically computed from observable network and subscriber state. This document formalizes the equations behind **Customer Impact**, **Business Impact**, and **Revenue at Risk**.

---

## 1. Traceability Architecture

```
[Cell Telemetry Sample]
         │
         ▼  (Delta vs Baseline)
[Anomaly Detection] ───> Latency Increase %, Packet Loss Increase %
         │
         ▼  (Join by serving Cell ID)
[Customer Exposure Matrix] ───> Affected Subscribers, High Risk Subset
         │
         ▼  (Financial & Churn Risk Weights)
[Business Impact Formulation] ───> Impact Score (0-100), Revenue at Risk (DZD)
```

---

## 2. Mathematical Formulations

### 2.1 Network Impact: KPI Deviation Vectors

For any monitored cell $c \in C_{\text{anomalous}}$:

$$\Delta \text{Latency}\%(c) = \frac{\text{Latency}_{\text{current}}(c) - \text{Latency}_{\text{baseline}}(c)}{\text{Latency}_{\text{baseline}}(c)} \times 100$$

$$\Delta \text{Loss}\%(c) = \frac{\text{Loss}_{\text{current}}(c) - \text{Loss}_{\text{baseline}}(c)}{\max(0.1, \text{Loss}_{\text{baseline}}(c))} \times 100$$

The aggregate network impact across an incident infrastructure footprint:

$$\overline{\Delta \text{Latency}\%} = \frac{1}{|C|} \sum_{c \in C} \Delta \text{Latency}\%(c)$$

$$\overline{\Delta \text{Loss}\%} = \frac{1}{|C|} \sum_{c \in C} \Delta \text{Loss}\%(c)$$

---

### 2.2 Customer Impact: Blast Radius & Risk Stratification

Let $S_{\text{affected}}$ be the set of active subscribers attached to $C_{\text{anomalous}}$:

$$S_{\text{affected}} = \{ s \in \text{Subscribers} \mid s.\text{attachedCellId} \in C_{\text{anomalous}} \lor s.\text{fallbackCellId} \in C_{\text{anomalous}} \}$$

$$N_{\text{affected}} = |S_{\text{affected}}|$$

For each affected subscriber $s$, their baseline churn probability $P_{\text{base}}(s)$ is updated by an exposure degradation penalty $D(s)$:

$$D(s) = \min\left(0.40, \left( \frac{\Delta \text{Latency}\%}{200} \times 0.20 \right) + \left( \frac{\Delta \text{Loss}\%}{100} \times 0.20 \right)\right)$$

$$P_{\text{exposed}}(s) = \min(0.98, P_{\text{base}}(s) + D(s))$$

Subscribers are classified into the **High Risk** subset $S_{\text{high}}$:

$$S_{\text{high}} = \{ s \in S_{\text{affected}} \mid P_{\text{exposed}}(s) \ge 0.65 \lor s.\text{complaints} \ge 2 \}$$

$$N_{\text{high}} = |S_{\text{high}}|$$

---

### 2.3 Business Impact: Revenue at Risk (DZD)

Revenue at risk represents the expected loss of monthly recurring revenue (ARPU) if the degradation causes churn without proactive intervention:

$$\text{RevenueAtRisk} = \sum_{s \in S_{\text{affected}}} \text{MonthlySpendDZD}(s) \times P_{\text{exposed}}(s) \times W_{\text{tier}}(s)$$

Where tier weights reflect contract and churn lifetime value:
- Enterprise B2B: $W_{\text{tier}} = 1.5$ (contract cancellation penalty + reputational SLA penalty)
- VIP Priority: $W_{\text{tier}} = 1.3$
- Consumer Postpaid: $W_{\text{tier}} = 1.0$
- Consumer Prepaid: $W_{\text{tier}} = 0.8$

---

### 2.4 Composite Business Impact Score (0–100)

The overall **Business Impact Score** $I \in [0, 100]$ synthesizes customer scale, financial exposure, and network severity:

$$I = \min\left(100, \text{round}\left( 0.35 \times I_{\text{network}} + 0.35 \times I_{\text{customers}} + 0.30 \times I_{\text{revenue}} \right)\right)$$

Where:
- $I_{\text{network}} = \min\left(100, \frac{\overline{\Delta \text{Latency}\%}}{1.5} + \overline{\Delta \text{Loss}\%} \times 2.0\right)$
- $I_{\text{customers}} = \min\left(100, \frac{N_{\text{affected}}}{20} + \frac{N_{\text{high}}}{5}\right)$
- $I_{\text{revenue}} = \min\left(100, \frac{\text{RevenueAtRisk}}{250}\right)$

---

## 3. Worked Example: Saïda Incident Trace

Given:
- Wilaya: Saïda (`DZ-20`)
- Impacted Sites: 3 (`SITE-SAI-001`, `SITE-SAI-002`, `SITE-SAI-003`)
- Impacted Cells: 7 sectors
- $\overline{\Delta \text{Latency}\%} = +38\%$
- $\overline{\Delta \text{Loss}\%} = +12\%$
- $N_{\text{affected}} = 1,284$ subscribers
- $N_{\text{high}} = 237$ high-risk subscribers
- Calculated Revenue at Risk = $12,500$ DZD
- Composite Impact Score = $87 / 100$

All numbers trace directly to the underlying subscriber registry and cell KPI matrices.
