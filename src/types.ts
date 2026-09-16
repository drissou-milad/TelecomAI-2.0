export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type CellStatus = 'normal' | 'warning' | 'anomaly';
export type UserRole = 'Admin' | 'Analyst';
export type SubscriptionType = 'Prepaid' | 'Postpaid';
export type ContractType = 'Month-to-month' | 'One year' | 'Two year';
export type InternetType = '4G LTE' | '5G NR' | 'Fiber optic' | 'DSL';

export interface RiskFactor {
  factor: string;
  impactPct: number;
  description: string;
  shapValue?: string;
}

export interface Customer {
  id: string;
  name: string;
  wilaya: string;
  monthlySpendDZD: number;
  dataUsageGB: number;
  callsCount: number;
  complaints: number;
  rechargeFrequency: number;
  subscription: SubscriptionType;
  tenureMonths: number;
  usageDeclinePct: number;
  contractType: ContractType;
  internetService: InternetType;
  paymentMethod: string;
  churnProbability: number; // 0 - 100
  riskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  recommendedAction: string;
  lastActiveDate: string;
  phoneNumber: string;
  attachedCellId?: string;
  cesScore?: number; // Customer Experience Score (0 - 100)
  cesBand?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  isVip?: boolean;
}

export interface NetworkCell {
  cellId: string;
  siteName: string;
  siteId?: string;
  wilaya: string;
  technology: '4G LTE' | '5G NR' | '3G';
  users: number;
  latencyMs: number;
  packetLossPct: number;
  trafficMbps: number;
  availabilityPct: number;
  jitterMs: number;
  status: CellStatus;
  anomalyScore: number; // -1.0 to 1.0 (Isolation Forest style: lower/negative = anomaly)
  anomalyConfidence: number; // 0 - 100
  possibleCauses: string[];
  aiIncidentSummary: string;
  lastAlarmTime: string;
  baselineLatency: number;
  baselineTraffic: number;
  frequencyBand?: string;
  azimuthDeg?: number;
  activeAlarms?: string[];
  prbUtilizationPct?: number;
  volteMos?: number; // Voice MOS (1.0 - 5.0)
  connectedVipCount?: number;
}

export interface ModelComparison {
  name: string;
  displayName?: string;
  isChampion?: boolean;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  trainTimeMs: number;
  confusionMatrix: {
    tp: number;
    fp: number;
    tn: number;
    fn: number;
  };
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  category: 'behavior' | 'billing' | 'tenure' | 'service';
}

export interface WilayaHealth {
  wilaya: string;
  healthPct: number;
  activeCells: number;
  anomalies: number;
  activeUsers: number;
  avgLatencyMs: number;
  avgPacketLossPct: number;
}

export interface TrafficForecastPoint {
  time: string;
  todayActual: number;
  predictedTomorrow: number;
  baseline: number;
}

export interface TelemetryTrendPoint {
  time: string;
  latency: number;
  packetLoss: number;
  jitter: number;
  throughput: number;
}

export interface DashboardSummary {
  networkHealth: number;
  activeUsers: number;
  highRiskCustomers: number;
  mediumRiskCustomers: number;
  totalCustomersScored: number;
  churnRatePct: number;
  averageChurnProbabilityPct: number;
  networkAnomalies: number;
  revenueAtRiskDZD: number;
  averageLatencyMs: number;
  packetLossAvgPct: number;
  totalCellsMonitored: number;
}

export interface QoSMetrics {
  volteMos: number; // 1.0 - 5.0 (Target > 4.0)
  videoQoE: number; // 0 - 100
  webLatencyMs: number;
  dropCallRatePct: number; // Target < 0.8%
  packetLossPct: number;
  prbCongestionPct: number;
  slaCompliancePct: number;
}

export interface NetworkCustomerImpact {
  cellId: string;
  siteName: string;
  wilaya: string;
  technology: string;
  status: CellStatus;
  connectedUsers: number;
  impactedSubscribers: number;
  highRiskSubscribers: number;
  vipAccountsCount: number;
  revenueAtRiskDZD: number;
  churnRiskUpliftPct: number; // e.g. +38% churn risk if cell remains degraded
  primaryDegradation: string;
  correlatedComplaints: number;
  recommendedIntervention: string;
}

export type IncidentPriority = 'P1-CRITICAL' | 'P2-HIGH' | 'P3-MEDIUM' | 'P4-LOW';
export type IncidentStatus = 'INVESTIGATING' | 'MITIGATING' | 'DISPATCHED_TO_ITSM' | 'RESOLVED';
export type ITSMPlatform = 'ServiceNow' | 'Jira Service Management' | 'BMC Remedy' | 'eTOM REST Webhook';

export interface ITSMTicket {
  platform: ITSMPlatform;
  externalTicketId: string;
  dispatchedAt: string;
  syncStatus: 'SYNCHRONIZED' | 'PENDING' | 'ACKNOWLEDGED';
  payloadSummary: string;
  assignedTeam: string;
}

export interface TelecomIncident {
  id: string; // e.g. 'INC-2026-089'
  title: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  cellId: string;
  siteId: string;
  siteName: string;
  wilaya: string;
  detectedAt: string;
  impactedSubscribers: number;
  vipAccountsCount: number;
  revenueAtRiskDZD: number;
  priorityScore: number; // AI Prioritization score 0 - 100
  anomalyScore: number;
  rootCauseDiagnosis: string;
  recommendedAction: string;
  itsmTicket?: ITSMTicket;
}

export interface SiteHierarchyNode {
  siteId: string;
  siteName: string;
  wilaya: string;
  siteType: 'Macro eNodeB' | '5G gNodeB Hub' | 'Micro SmallCell' | 'Microwave Backhaul Hub';
  carrierBand: string;
  totalSectors: number;
  cells: string[];
  healthScore: number; // 0 - 100
  status: CellStatus;
  connectedUsers: number;
  backhaulLatencyMs: number;
  activeAlarmsCount: number;
}

