# TelecomAI 2.0 — REST API Documentation

The TelecomAI 2.0 platform exposes a unified, high-performance REST API running on Express + TypeScript with sub-5ms native inference. All responses return structured JSON with explicit synthetic data disclosures.

---

## Base URL
```
http://localhost:3000/api
```
All routes are prefixed with `/api` (legacy non-prefixed paths are automatically aliased for backward compatibility).

---

## 1. Network & Topology APIs

### `GET /api/network/overview`
Returns platform-wide headline network KPIs, aggregated health scores, active anomalies, blast radius, and regional breakdown.

#### Response `200 OK`
```json
{
  "network_health_score": 87,
  "active_sites": 18,
  "active_cells": 38,
  "detected_anomalies": 7,
  "warning_cells": 0,
  "affected_customers": 1284,
  "high_risk_customers": 237,
  "revenue_at_risk_dzd": 12500,
  "open_incidents_count": 2,
  "regional_breakdown": [
    {
      "wilaya": "Saida",
      "code": "20",
      "region": "High-Plateaux",
      "sites": 48,
      "cells": 7,
      "anomalies": 7,
      "healthScore": 58,
      "status": "ANOMALY"
    },
    {
      "wilaya": "Algiers",
      "code": "16",
      "region": "North",
      "sites": 512,
      "cells": 5,
      "anomalies": 0,
      "healthScore": 97,
      "status": "HEALTHY"
    }
  ],
  "synthetic_disclaimer": "Synthetic telecom environment — illustrative data, not real operator statistics.",
  "last_updated": "2026-09-15T08:42:15.000Z"
}
```

---

### `GET /api/network/cells`
Lists cellular radio sectors with health scores and telemetry.

#### Query Parameters
- `wilaya` *(optional, string)*: Filter by Algerian wilaya (e.g. `Saida`, `Algiers`, `Oran`, `Tlemcen`).
- `status` *(optional, string)*: Filter by status (`normal`, `warning`, `anomaly`).
- `siteId` *(optional, string)*: Filter by parent base station (e.g. `SITE-SAI-001`).

#### Response `200 OK`
```json
{
  "cells": [
    {
      "cellId": "CELL-SAI-001A",
      "siteId": "SITE-SAI-001",
      "siteName": "Saïda Centre Ville",
      "wilaya": "Saida",
      "technology": "4G-LTE",
      "carrierFreqMHz": 1800,
      "status": "anomaly",
      "healthScore": 25,
      "currentTelemetry": {
        "cellId": "CELL-SAI-001A",
        "users": 182,
        "latencyMs": 29.2,
        "packetLossPct": 3.6,
        "trafficMbps": 41.2,
        "availabilityPct": 93.8,
        "prbUtilizationPct": 88.5
      }
    }
  ],
  "count": 38
}
```

---

### `GET /api/network/cells/:id`
Returns in-depth baseline vs. current telemetry, health calculation, and attached subscribers for a specific cell.

---

## 2. Customer Intelligence & CXS APIs

### `GET /api/customers`
Retrieves subscriber records with computed Customer Experience Score (CXS 0–100), churn risk probability, and current network exposure.

#### Query Parameters
- `wilaya` *(optional, string)*: e.g. `Saida`.
- `highRisk` *(optional, boolean)*: `true` or `false`.
- `cellId` *(optional, string)*: e.g. `CELL-SAI-001A`.

---

### `GET /api/customers/:id`
Retrieves customer profile with serving cell, fallback cell, and detailed CXS breakdown.

---

### `GET /api/customers/:id/experience`
Returns the 4-component CXS weighted breakdown (Network QoE 35%, Care 30%, Usage 20%, Loyalty 15%) and explainable SHAP attributions.

---

## 3. Incident Intelligence & Correlation APIs

### `GET /api/incidents`
Lists all prioritized incidents with deduplicated infrastructure footprint, impact blast radius, and AI assessments.

#### Response `200 OK`
```json
{
  "incidents": [
    {
      "incident_id": "INC-0001",
      "title": "Regional Network Degradation - Saïda Transport Backhaul",
      "severity": "HIGH",
      "priority": "P1",
      "status": "INVESTIGATING",
      "detected_at": "2026-09-15T08:15:00.000Z",
      "infrastructure": {
        "wilaya": "Saida",
        "sites": 3,
        "cells": 7,
        "siteIds": ["SITE-SAI-001", "SITE-SAI-002", "SITE-SAI-003"],
        "cellIds": ["CELL-SAI-001A", "CELL-SAI-001B", "CELL-SAI-002A", "CELL-SAI-002B", "CELL-SAI-002C", "CELL-SAI-003A", "CELL-SAI-003B"]
      },
      "network_impact": {
        "latency_increase_pct": 38,
        "packet_loss_increase_pct": 12
      },
      "customer_impact": {
        "affected_customers": 1284,
        "high_risk_customers": 237
      },
      "business_impact": {
        "impact_score": 87,
        "revenue_at_risk": 12500
      },
      "ai_analysis": {
        "assessment": "High-volume congestion and packet drop anomaly detected across 7 radio sectors in Saida.",
        "recommended_action": "Execute automated microwave link carrier failover on SITE-SAI-001.",
        "confidence": 0.84
      }
    }
  ],
  "count": 2
}
```

---

### `GET /api/incidents/:id`
Retrieves single incident with root-cause indicators, telemetry deltas, and ITSM link.

---

### `PATCH /api/incidents/:id`
Updates incident status or fields.

#### Request Body
```json
{
  "status": "DISPATCHED"
}
```

---

### `GET /api/ai/incidents/:id/analysis`
Produces the **6-Question Operational Assessment** for an incident:
1. What happened?
2. Why is it important?
3. Who is affected?
4. What evidence supports this?
5. What should operations investigate next?
6. Recommended action + Confidence score.

---

## 4. Enterprise ITSM Connector APIs

### `POST /api/integrations/itsm/ticket`
Dispatches an operational incident to the enterprise ITSM bridge (formats payloads for ServiceNow Table API or Jira Service Management REST API).

#### Request Body
```json
{
  "incident_id": "INC-0001",
  "title": "Saïda Backhaul Congestion",
  "priority": "P1",
  "severity": "CRITICAL",
  "system": "ServiceNow"
}
```

#### Response `201 Created`
```json
{
  "ticket_id": "INC-SNOW-89421",
  "incident_id": "INC-0001",
  "external_url": "https://service-now.example.com/nav_to.do?uri=incident.do?sysparm_id=INC-SNOW-89421",
  "system": "ServiceNow",
  "priority": "P1",
  "severity": "CRITICAL",
  "status": "ASSIGNED",
  "assigned_group": "RAN_ENGINEERING_TIER_2",
  "created_at": "2026-09-15T08:42:15.000Z",
  "summary": "AI Incident Dispatch: Saïda Backhaul Congestion",
  "work_notes": [
    "TelecomAI 2.0 AI Correlation Engine detected cross-domain anomaly.",
    "Blast radius: 1,284 subscribers exposed, 12,500 DZD monthly recurring revenue at risk."
  ]
}
```

---

## 5. Demonstration Simulation & Scenario Center

### `POST /api/simulation/scenario`
Executes an operational scenario (Normal, Backhaul Congestion, Cell Congestion, High Latency, Packet Loss, Site Outage, Regional Outage).

#### Request Body
```json
{
  "scenario": "backhaul_congestion",
  "severity": "CRITICAL",
  "wilaya": "Saida"
}
```

---

### `POST /api/simulation/reset`
Restores all radio cells, base station sites, and subscribers to nominal baseline metrics.

---

### `GET /api/simulation/status`
Returns the current simulation execution state, active scenario, and degraded count.

---

## 6. Real-Time Operations Event Stream

### `GET /api/events`
Returns live chronological operational audit events (`ANOMALY_DETECTED`, `IMPACT_CALCULATED`, `INCIDENT_CREATED`, `PRIORITY_ASSIGNED`, `AI_ANALYSIS_COMPLETED`, `ITSM_WORK_ORDER_CREATED`).

---

## 7. Model Performance & Benchmarks

### `GET /api/models/performance`
Returns multi-model evaluation benchmarks (Gradient Boosting 0.961 ROC-AUC, Random Forest 0.958, Decision Tree 0.924, Logistic Regression 0.926) along with scientific synthetic data disclaimers.
