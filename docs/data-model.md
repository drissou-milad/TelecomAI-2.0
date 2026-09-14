# TelecomAI 2.0 — Data Model Specifications

This document defines the schema contracts and entity relationships across the four core domains: **Network**, **Customer**, **Incident**, and **Integration**.

---

## 1. Network Domain

```
[Wilaya] 1 ──── N [Site] 1 ──── N [Cell] 1 ──── N [Telemetry]
                                    │
                                    └─── 0..N [Anomaly]
```

### 1.1 Wilaya
- `id`: string (e.g., `DZ-16` for Algiers, `DZ-20` for Saïda)
- `code`: string (e.g., `16`, `20`, `31`, `13`)
- `name`: string (e.g., `Saida`, `Algiers`, `Oran`, `Tlemcen`, `Constantine`)
- `region`: `'North'` | `'West'` | `'East'` | `'South'` | `'High-Plateaux'`
- `subscriberCount`: number
- `siteCount`: number

### 1.2 Site (Base Station / eNodeB / gNodeB)
- `siteId`: string (e.g., `SITE-SAI-001`, `SITE-ALG-014`)
- `siteName`: string (e.g., `Saida Centre Ville`, `Bab Ezzouar Tech Park`)
- `wilaya`: string
- `latitude`: number
- `longitude`: number
- `siteType`: `'Macro eNodeB'` | `'5G gNodeB Hub'` | `'Micro Small Cell'` | `'Microwave Backhaul Hub'`
- `carrierBand`: string (e.g., `B3 (1800 MHz) + B7 (2600 MHz)`, `N78 (3.5 GHz)`)
- `backhaulType`: `'Fiber'` | `'Microwave 10Gbps'` | `'Satellite'`
- `cells`: string[] (List of Cell IDs hosted on this tower)
- `status`: `'normal'` | `'warning'` | `'anomaly'`

### 1.3 Cell (Radio Sector Carrier)
- `cellId`: string (e.g., `CELL-SAI-001A`, `CELL-003`, `CELL-TLM-034`)
- `siteId`: string
- `azimuth`: number (degrees: 0°, 120°, 240°)
- `technology`: `'4G-LTE'` | `'5G-NR'` | `'3G-HSPA'`
- `nominalBaseline`:
  - `latencyMs`: number (e.g. 24.0)
  - `packetLossPct`: number (e.g. 0.3)
  - `trafficMbps`: number (e.g. 180.0)
  - `availabilityPct`: number (e.g. 99.8)
  - `prbUtilizationPct`: number (e.g. 48.0)
  - `callDropRatePct`: number (e.g. 0.4)
  - `callSetupSuccessRatePct`: number (e.g. 99.2)

### 1.4 Telemetry (Time-Series Metric Sample)
- `cellId`: string
- `timestamp`: string (ISO-8601)
- `users`: number (Active connected RRC users)
- `latencyMs`: number (Round-trip time in milliseconds)
- `packetLossPct`: number (User-plane packet error loss rate)
- `trafficMbps`: number (Downlink + Uplink aggregate throughput)
- `availabilityPct`: number (Radio link uptime percentage)
- `prbUtilizationPct`: number (Physical Resource Block load %)
- `callDropRatePct`: number (CDR %)
- `callSetupSuccessRatePct`: number (CSSR %)

### 1.5 Network Anomaly
- `anomalyId`: string (e.g., `ANOM-2026-0819`)
- `cellId`: string
- `detectedAt`: string (ISO-8601)
- `status`: `'ACTIVE'` | `'RESOLVED'`
- `deviations`:
  - `latencyDeviationPct`: number
  - `packetLossDeviationPct`: number
  - `trafficDropPct`: number
  - `availabilityDropPct`: number
- `anomalyScore`: number (0.00 – 1.00)
- `suspectedCause`: string (e.g. "PRB Congestion & Backhaul Packet Loss")

---

## 2. Customer Domain

```
[Customer] 1 ──── 1 [Subscription]
    │
    ├─── 1 [Network Exposure] ────> (Associated with Cell)
    ├─── 1 [Experience Score]
    └─── 1 [Churn Risk]
```

### 2.1 Customer
- `customerId`: string (e.g., `CUST-10492`)
- `name`: string
- `wilaya`: string
- `segment`: `'Enterprise B2B'` | `'Consumer Postpaid'` | `'Consumer Prepaid'` | `'VIP Priority'`
- `tenureMonths`: number
- `monthlySpendDZD`: number (ARPU in Algerian Dinars)
- `complaints`: number (Count of open/recent helpdesk tickets)

### 2.2 Subscription
- `subscriptionType`: `'Prepaid'` | `'Postpaid'`
- `planName`: string (e.g., `4G Gold 50GB`, `Business Pro Unlimited`, `Prepaid Haya 1000`)
- `dataQuotaGB`: number
- `dataUsedGB`: number
- `rechargeCadenceDays`: number

### 2.3 Network Exposure
- `currentCellId`: string
- `fallbackCellId`: string
- `exposureDurationMinutes`: number
- `experiencedPacketLossPct`: number
- `experiencedLatencyMs`: number
- `networkQualityScore`: number (0–100)

### 2.4 Experience Score (Customer Experience Index - CEI)
- `score`: number (0–100)
- `band`: `'EXCELLENT'` | `'GOOD'` | `'FAIR'` | `'POOR'`
- `breakdown`:
  - `networkQoE`: number (35% weight: latency, packet loss, drops)
  - `billingCare`: number (30% weight: complaints, billing disputes)
  - `usageStability`: number (20% weight: data consumption trend)
  - `tenureLoyalty`: number (15% weight: subscriber lifetime)

### 2.5 Churn Risk
- `baselineChurnProbability`: number (0.00–1.00 from ML Model)
- `exposureAdjustedChurnProbability`: number (Adjusted for real-time network degradation)
- `riskLevel`: `'HIGH'` | `'MEDIUM'` | `'LOW'`
- `keyDrivers`: string[]

---

## 3. Incident Domain

```
[Network Anomaly] 1..N ────> [Incident] ────> [Impact]
                                  │
                                  ├─── [Evidence]
                                  ├─── [AI Analysis & Recommendation]
                                  └─── [ITSM Ticket]
```

### 3.1 Incident
- `incidentId`: string (e.g., `INC-2026-0042`, `INC-0001`)
- `title`: string
- `wilaya`: string
- `affectedSites`: string[]
- `affectedCells`: string[]
- `detectedAt`: string (ISO-8601)
- `status`: `'NEW'` | `'INVESTIGATING'` | `'DISPATCHED'` | `'RESOLVED'`

### 3.2 Severity & Priority
- `severity`: `'CRITICAL'` | `'HIGH'` | `'MEDIUM'` | `'LOW'`
  - Derived from KPI breach depth (Packet loss > 5%, Availability < 95%, Latency > 100ms)
- `priority`: `'P1'` | `'P2'` | `'P3'` | `'P4'`
  - Deterministic function of Severity × Customer Blast Radius × Revenue at Risk
- `slaTargetMinutes`: number (P1: 60 min, P2: 120 min, P3: 240 min, P4: 720 min)

### 3.3 Evidence
- `kpiDeltas`:
  - `latencyBaselineMs`: number
  - `latencyCurrentMs`: number
  - `latencyIncreasePct`: number
  - `packetLossBaselinePct`: number
  - `packetLossCurrentPct`: number
  - `packetLossIncreasePct`: number
- `affectedSectorsSummary`: string
- `correlatedAlarmCodes`: string[]

### 3.4 Impact
- `networkImpact`:
  - `cellsAffected`: number
  - `sitesAffected`: number
  - `throughputLossMbps`: number
- `customerImpact`:
  - `affectedCustomers`: number
  - `highRiskCustomers`: number
  - `enterpriseCustomers`: number
- `businessImpact`:
  - `impactScore`: number (0–100 composite index)
  - `revenueAtRiskDZD`: number ($\sum \text{Monthly Spend} \times \text{Exposure Factor}$)

### 3.5 Recommendation
- `technicalAction`: string (e.g. "Trigger microwave backhaul carrier failover to protection path")
- `customerCareAction`: string (e.g. "Send proactive SMS apology + credit 5GB data bonus")
- `confidence`: number (0.00–1.00)

---

## 4. Integration Domain

### 4.1 ITSM Ticket
- `ticketId`: string (e.g., `INC0089201`, `JIRA-NOC-442`)
- `system`: `'ServiceNow'` | `'Jira Service Management'` | `'BMC Remedy'` | `'Custom Webhook'`
- `externalStatus`: `'New'` | `'In Progress'` | `'Assigned'` | `'Closed'`
- `dispatchedAt`: string
- `assignedTeam`: string (e.g. "RAN Field Engineering", "Core IP Backhaul Team")

### 4.2 Connector Configuration
- `connectorType`: `'REST'` | `'WEBHOOK'`
- `targetUrl`: string
- `authHeader`: string
- `headers`: Record<string, string>
- `status`: `'CONNECTED'` | `'DEGRADED'` | `'MOCK_ENABLED'`
