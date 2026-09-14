/**
 * TelecomAI 2.0 — Typed Contracts
 * Strictly typed definitions for Network, Customer, Incident, and Integration domains.
 */

// ==========================================
// 1. NETWORK DOMAIN
// ==========================================

export type WilayaCode = '16' | '20' | '31' | '13' | '25' | '19';

export interface Wilaya {
  id: string;
  code: WilayaCode;
  name: string;
  region: 'North' | 'West' | 'East' | 'South' | 'High-Plateaux';
  subscriberCount: number;
  siteCount: number;
}

export type SiteType = 'Macro eNodeB' | '5G gNodeB Hub' | 'Micro Small Cell' | 'Microwave Backhaul Hub';
export type BackhaulType = 'Fiber' | 'Microwave 10Gbps' | 'Satellite' | 'Dark Fiber Ring';

export interface Site {
  siteId: string;
  siteName: string;
  wilaya: string;
  latitude: number;
  longitude: number;
  siteType: SiteType;
  carrierBand: string;
  backhaulType: BackhaulType;
  cells: string[];
  status: 'normal' | 'warning' | 'anomaly';
  healthScore: number;
}

export interface CellNominalBaseline {
  latencyMs: number;
  packetLossPct: number;
  trafficMbps: number;
  availabilityPct: number;
  prbUtilizationPct: number;
  callDropRatePct: number;
  callSetupSuccessRatePct: number;
}

export interface Cell {
  cellId: string;
  siteId: string;
  siteName: string;
  wilaya: string;
  azimuth: number;
  technology: '4G-LTE' | '5G-NR' | '3G-HSPA';
  carrierFreqMHz: number;
  status: 'normal' | 'warning' | 'anomaly';
  nominalBaseline: CellNominalBaseline;
  currentTelemetry: TelemetrySample;
}

export interface TelemetrySample {
  cellId: string;
  timestamp: string;
  users: number;
  latencyMs: number;
  packetLossPct: number;
  trafficMbps: number;
  availabilityPct: number;
  prbUtilizationPct: number;
  callDropRatePct?: number;
  callSetupSuccessRatePct?: number;
}

export interface AnomalyDetectionRecord {
  anomalyId: string;
  cellId: string;
  siteId: string;
  wilaya: string;
  detectedAt: string;
  anomalyScore: number;
  latencyIncreasePct: number;
  packetLossIncreasePct: number;
  trafficDeviationPct: number;
  availabilityDropPct: number;
  primaryCause: string;
}

// ==========================================
// 2. CUSTOMER DOMAIN
// ==========================================

export type CustomerSegment = 'Enterprise B2B' | 'VIP Priority' | 'Consumer Postpaid' | 'Consumer Prepaid';

export interface Customer2 {
  customerId: string;
  name: string;
  wilaya: string;
  segment: CustomerSegment;
  subscriptionType: 'Prepaid' | 'Postpaid';
  planName: string;
  monthlySpendDZD: number;
  tenureMonths: number;
  complaints: number;
  attachedCellId: string;
  fallbackCellId?: string;
  baselineChurnRisk: number; // 0.00 - 1.00
  dataUsageGB: number;
  callsCount: number;
  rechargeFrequencyDays: number;
}

export interface CustomerExperienceIndex {
  score: number; // 0 - 100
  band: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  breakdown: {
    networkQoE: number; // 35% weight
    billingCare: number; // 30% weight
    usageStability: number; // 20% weight
    tenureLoyalty: number; // 15% weight
  };
}

// ==========================================
// 3. INCIDENT DOMAIN
// ==========================================

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type IncidentStatus = 'NEW' | 'INVESTIGATING' | 'DISPATCHED' | 'RESOLVED';

export interface IncidentEvidence {
  detected_at: string;
  root_cause_indicators: string[];
  telemetry_deltas: {
    latency_baseline_ms: number;
    latency_current_ms: number;
    latency_increase_pct: number;
    packet_loss_baseline_pct: number;
    packet_loss_current_pct: number;
    packet_loss_increase_pct: number;
  };
}

export interface Incident2 {
  incident_id: string;
  title: string;
  severity: IncidentSeverity;
  priority: IncidentPriority;
  status: IncidentStatus;
  detected_at: string;
  infrastructure: {
    wilaya: string;
    sites: number;
    cells: number;
    siteIds: string[];
    cellIds: string[];
  };
  network_impact: {
    latency_increase_pct: number;
    packet_loss_increase_pct: number;
  };
  customer_impact: {
    affected_customers: number;
    high_risk_customers: number;
  };
  business_impact: {
    impact_score: number;
    revenue_at_risk: number;
  };
  ai_analysis: {
    assessment: string;
    recommended_action: string;
    confidence: number;
  };
  evidence?: IncidentEvidence;
  itsm_ticket?: {
    ticket_id: string;
    system: 'ServiceNow' | 'Jira Service Management' | 'BMC Remedy';
    dispatched_at: string;
    status: string;
  };
}

// ==========================================
// 4. ITSM DOMAIN CONTRACTS
// ==========================================

export interface ITSMTicketRequest {
  incident_id: string;
  title: string;
  priority: IncidentPriority;
  severity: IncidentSeverity;
  affected_infrastructure: {
    wilaya: string;
    sites: number;
    cells: number;
    cell_ids: string[];
    site_ids: string[];
  };
  customer_impact: {
    affected_customers: number;
    high_risk_customers: number;
  };
  business_impact: {
    impact_score: number;
    revenue_at_risk_dzd: number;
  };
  ai_assessment: string;
  recommended_action: string;
  confidence: number;
  system?: 'ServiceNow' | 'Jira Service Management' | 'BMC Remedy';
}

export interface ITSMTicket {
  ticket_id: string;
  incident_id: string;
  external_url: string;
  system: 'ServiceNow' | 'Jira Service Management' | 'BMC Remedy';
  priority: IncidentPriority;
  severity: IncidentSeverity;
  status: 'NEW' | 'ASSIGNED' | 'WORK_IN_PROGRESS' | 'RESOLVED';
  assigned_group: string;
  created_at: string;
  updated_at: string;
  summary: string;
  work_notes: string[];
}

// ==========================================
// 5. SIMULATION CONTRACTS
// ==========================================

export interface SimulationState {
  isActive: boolean;
  scenarioName: string;
  targetWilaya: string;
  degradedCellCount: number;
  simulatedIncidentId: string;
  startedAt: string | null;
  currentAnomalyCount: number;
}

// ==========================================
// 6. API CONTRACTS
// ==========================================

export interface NetworkAnalyzeRequest {
  wilaya?: string;
  siteId?: string;
  cellIds?: string[];
  telemetryOverrides?: Partial<TelemetrySample>[];
  triggerReason?: string;
}

export interface NetworkAnalyzeResponse {
  incident_id: string;
  severity: IncidentSeverity;
  priority: IncidentPriority;
  infrastructure: {
    wilaya: string;
    sites: number;
    cells: number;
  };
  network_impact: {
    latency_increase_pct: number;
    packet_loss_increase_pct: number;
  };
  customer_impact: {
    affected_customers: number;
    high_risk_customers: number;
  };
  business_impact: {
    impact_score: number;
    revenue_at_risk: number;
  };
  ai_analysis: {
    assessment: string;
    recommended_action: string;
    confidence: number;
  };
  traceability?: {
    analyzed_cells: string[];
    analyzed_sites: string[];
    kpi_summary: {
      avg_latency_ms: number;
      baseline_latency_ms: number;
      avg_loss_pct: number;
      baseline_loss_pct: number;
    };
    customer_sample_ids: string[];
    generated_at: string;
  };
}

