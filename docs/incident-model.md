# TelecomAI 2.0 — Incident Intelligence Model

## 1. Incident Lifecycle & Deduplication

In a telecommunications network, a single backhaul fiber cut or hardware failure typically triggers hundreds of alarms across adjacent radio sectors. Without intelligent aggregation, Network Operations Center (NOC) operators experience alarm fatigue.

TelecomAI 2.0 deduplicates and correlates anomalies into canonical **Telecom Incidents**:

```
[Cell Alarm A1] ┐
[Cell Alarm A2] ┼──> [Spatial & Cluster Aggregator] ──> [Canonical Incident]
[Cell Alarm A3] ┘           (Same Site / Wilaya)              (e.g., INC-0001)
```

### Lifecycle States:
1. `NEW`: Auto-generated upon anomaly cluster confirmation.
2. `INVESTIGATING`: Correlating subscriber impact and computing blast radius.
3. `DISPATCHED`: Automated work order created in external ITSM (ServiceNow / Jira).
4. `RESOLVED`: Radio KPIs returned to nominal baselines for $\ge 30$ continuous minutes.

---

## 2. Severity Classification Matrix

Severity reflects the **technical depth of infrastructure degradation**:

| Severity | Technical Criteria | Packet Loss | Availability |
| :--- | :--- | :--- | :--- |
| **CRITICAL** | Total sector outage or backhaul failure | $> 10\%$ | $< 90\%$ |
| **HIGH** | Severe congestion or high error rates | $5\% - 10\%$ | $90\% - 95\%$ |
| **MEDIUM** | Noticeable degradation impacting streaming/gaming | $2\% - 5\%$ | $95\% - 98\%$ |
| **LOW** | Minor baseline variance or early warning drift | $< 2\%$ | $\ge 98\%$ |

---

## 3. Dynamic Priority Matrix (P1 to P4)

Priority dictates **operational urgency and SLA countdown** by combining technical Severity with **Business Impact**:

$$\text{Priority} = f(\text{Severity}, \text{Blast Radius } (N_{\text{affected}}), \text{Revenue at Risk})$$

| Priority | Criteria | SLA Target | Automated Action |
| :--- | :--- | :--- | :--- |
| **P1 - Critical** | Severity $\ge$ HIGH AND ($N_{\text{affected}} \ge 1,000$ OR Revenue at Risk $\ge 10,000$ DZD) | **60 min** | Immediate on-call pager, auto-ticket to Field Ops, proactive VIP SMS relief |
| **P2 - High** | Severity $\ge$ MEDIUM AND ($N_{\text{affected}} \ge 300$ OR Revenue at Risk $\ge 3,000$ DZD) | **120 min** | Auto-ticket to NOC Team 2, monitoring escalation |
| **P3 - Medium** | Standard single-sector degradation | **240 min** | Queued in next dispatch sprint |
| **P4 - Low** | Minor telemetry drift without critical customer impact | **720 min** | Scheduled maintenance queue |

---

## 4. Evidence Structure

Every incident carries an immutable audit payload of evidence:

```json
{
  "incident_id": "INC-0001",
  "evidence": {
    "detected_at": "2026-09-14T09:30:00Z",
    "root_cause_indicators": [
      "Microwave link RSSI drop of -14 dBm detected on backhaul hop",
      "PRB utilization pegged at 94% on sector carrier B3",
      "Elevation in RRC Connection Re-establishment failures (+42%)"
    ],
    "telemetry_deltas": {
      "latency_baseline_ms": 22.4,
      "latency_current_ms": 30.9,
      "latency_increase_pct": 38,
      "packet_loss_baseline_pct": 0.35,
      "packet_loss_current_pct": 3.92,
      "packet_loss_increase_pct": 12
    }
  }
}
```

---

## 5. Integration with External Systems

Incidents sync bidirectionally through the **ITSM Connector**:
- Generates standard payloads for ServiceNow (`incident` table), Jira Service Management (issue type `Incident`), and BMC Remedy.
- Maintains ticket ID mappings (`INC0089201`, `JIRA-NOC-442`) and synchronization state.
