# TelecomAI 2.0 — System Architecture

## 1. High-Level Vision & Evolution

TelecomAI 1.0 served as a standalone machine learning proof-of-concept for churn prediction and cell anomaly detection.

**TelecomAI 2.0** re-engineers this foundation into an integrated **Autonomous Operations & Customer Impact Intelligence Platform**:
`Understand → Correlate → Prioritize → Act`

```
                    TELECOM DATA
                         │
            ┌────────────┴────────────┐
            ↓                         ↓
      NETWORK DATA              CUSTOMER DATA
            │                         │
            ↓                         ↓
   Network Intelligence       CX Intelligence
            │                         │
            └────────────┬────────────┘
                         ↓
                AI CORRELATION ENGINE
                         │
                         ↓
                 CUSTOMER IMPACT
                         │
                         ↓
                  BUSINESS IMPACT
                         │
                         ↓
              INCIDENT INTELLIGENCE
                         │
                  ┌──────┴──────┐
                  ↓             ↓
             PRIORITY       AI ANALYSIS
                  │             │
                  └──────┬──────┘
                         ↓
                 RECOMMENDED ACTION
                         │
                         ↓
                  ITSM CONNECTOR
```

---

## 2. Core Operational Pipeline

### 2.1 Network Intelligence
- Ingests cell-level 3GPP telemetry (PRB utilization, Latency RTT, Packet Loss %, Throughput Mbps, Availability %, CDR, CSSR).
- Tracks hierarchical relationships: **Wilaya** ➔ **Site** (Base Station / eNodeB / gNodeB) ➔ **Cell** (Radio Carrier Sector).
- Detects multi-metric anomalies based on deviations from running statistical baselines.

### 2.2 Customer Experience (CX) Intelligence
- Tracks subscribers, active service subscriptions, monthly billing/spend (DZD), voice/data quotas, tenure, and customer care tickets.
- Tracks **Network Exposure**: which cell carrier a subscriber is connected to and their recent degradation history.
- Calculates dynamic **Customer Experience Index (CEI)** (0–100) combining Network QoE, Service/Billing dispute history, Usage stability, and Tenure loyalty.

### 2.3 AI Correlation Engine
- Resolves the causal chain:
  `Physical RAN Degradation ➔ Poor Subscriber QoE ➔ Churn Acceleration`
- Evaluates real blast radius: maps degraded cells to actively connected subscribers.
- Quantifies **Business Impact**: aggregate monthly revenue at risk (DZD) and elevated churn probability for affected subscribers.

### 2.4 Incident Intelligence
- Groups related cellular anomalies into singular, deduplicated **Telecom Incidents**.
- Determines severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) and dynamically calculates operational priority (`P1`, `P2`, `P3`, `P4`) based on customer blast radius, revenue exposure, and service criticality.
- Provides AI-synthesized root-cause evidence and confidence scoring.

### 2.5 Recommended Actions & ITSM Connector
- Generates engineering playbooks (e.g. antenna tilt rebalancing, microwave backhaul carrier failover, RRU reset) and customer care compensations (e.g. 5GB goodwill data credit).
- Connects to enterprise ITSM systems (ServiceNow Table API, Jira Service Management REST API, Webhooks).

---

## 3. Data Integrity & Traceability Mandate

Every single number displayed in TelecomAI 2.0 must have a verifiable origin:
$$\text{UI Component} \longrightarrow \text{REST API} \longrightarrow \text{Correlation Service} \longrightarrow \text{Data / Baseline Model}$$

No arbitrary or hardcoded placeholder values are used.
