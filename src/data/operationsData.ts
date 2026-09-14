import { 
  QoSMetrics, 
  NetworkCustomerImpact, 
  TelecomIncident, 
  SiteHierarchyNode, 
  ITSMPlatform,
  Customer,
  NetworkCell
} from '../types';

export const INITIAL_QOS_METRICS: QoSMetrics = {
  volteMos: 4.21, // Voice MOS scale 1.0 - 5.0 (Target > 4.0)
  videoQoE: 88.4, // Video streaming quality score (0 - 100)
  webLatencyMs: 32.8, // Round-trip DNS + HTTP latency
  dropCallRatePct: 0.42, // Target < 0.8%
  packetLossPct: 0.59,
  prbCongestionPct: 6.8, // Physical Resource Block congestion
  slaCompliancePct: 99.2 // Enterprise SLA threshold 99.0%
};

export const INITIAL_IMPACTS: NetworkCustomerImpact[] = [
  {
    cellId: 'CELL-003',
    siteName: 'Bab Ezzouar Business Park',
    wilaya: 'Algiers',
    technology: '4G LTE',
    status: 'anomaly',
    connectedUsers: 1942,
    impactedSubscribers: 1850,
    highRiskSubscribers: 148,
    vipAccountsCount: 42,
    revenueAtRiskDZD: 312000,
    churnRiskUpliftPct: 38,
    primaryDegradation: 'PRB Utilization >94% & Transport Latency Spike (97ms)',
    correlatedComplaints: 14,
    recommendedIntervention: 'Execute active beam tilt deflection & offload 35% carrier traffic to adjacent CELL-001 (5G NR).'
  },
  {
    cellId: 'CELL-TLM-034',
    siteName: 'Tlemcen Plateau Mansourah',
    wilaya: 'Tlemcen',
    technology: '4G LTE',
    status: 'anomaly',
    connectedUsers: 1420,
    impactedSubscribers: 1380,
    highRiskSubscribers: 96,
    vipAccountsCount: 19,
    revenueAtRiskDZD: 248500,
    churnRiskUpliftPct: 44,
    primaryDegradation: 'Backhaul Microwave Packet Loss (5.2%) & Frame Jitter (22ms)',
    correlatedComplaints: 9,
    recommendedIntervention: 'Switch backhaul transmission to secondary fiber ring & trigger automated VIP apology SMS.'
  },
  {
    cellId: 'CELL-005',
    siteName: 'Oran Port Terminal',
    wilaya: 'Oran',
    technology: '4G LTE',
    status: 'warning',
    connectedUsers: 890,
    impactedSubscribers: 520,
    highRiskSubscribers: 34,
    vipAccountsCount: 12,
    revenueAtRiskDZD: 94000,
    churnRiskUpliftPct: 18,
    primaryDegradation: 'Intermittent Radio Interference (SINR < 6dB) during peak crane operations',
    correlatedComplaints: 3,
    recommendedIntervention: 'Adjust frequency channel allocation to mitigate crane radar harmonic interference.'
  },
  {
    cellId: 'CELL-007',
    siteName: 'Constantine Plateau Didouche',
    wilaya: 'Constantine',
    technology: '5G NR',
    status: 'warning',
    connectedUsers: 640,
    impactedSubscribers: 310,
    highRiskSubscribers: 22,
    vipAccountsCount: 8,
    revenueAtRiskDZD: 58000,
    churnRiskUpliftPct: 12,
    primaryDegradation: 'Occasional High Jitter (11.2ms) on 5G NR Uplink',
    correlatedComplaints: 2,
    recommendedIntervention: 'Rebalance gNodeB subcarrier spacing and re-verify backhaul synchronization.'
  }
];

export const INITIAL_INCIDENTS: TelecomIncident[] = [
  {
    id: 'INC-2026-089',
    title: 'PRB Congestion & Latency Surge — Bab Ezzouar Business Park',
    priority: 'P1-CRITICAL',
    status: 'INVESTIGATING',
    cellId: 'CELL-003',
    siteId: 'SITE-ALG-03',
    siteName: 'Bab Ezzouar Technology Hub',
    wilaya: 'Algiers',
    detectedAt: '12 min ago (09:42 UTC)',
    impactedSubscribers: 1850,
    vipAccountsCount: 42,
    revenueAtRiskDZD: 312000,
    priorityScore: 94,
    anomalyScore: -0.42,
    rootCauseDiagnosis: '3GPP Physical Downlink Shared Channel (PDSCH) PRB saturation (>94%) triggered by localized morning corporate peak. Transport RTT degraded from 32ms nominal to 97ms.',
    recommendedAction: '1. Re-route 35% mobile broadband traffic to CELL-001 5G NR beam.\n2. Trigger automated proactive ITSM incident ticket to Transport Operations.\n3. Send proactive high-priority care notices to 42 enterprise accounts.',
    itsmTicket: undefined
  },
  {
    id: 'INC-2026-034',
    title: 'Severe Microwave Backhaul Packet Loss — Tlemcen Mansourah',
    priority: 'P1-CRITICAL',
    status: 'DISPATCHED_TO_ITSM',
    cellId: 'CELL-TLM-034',
    siteId: 'SITE-TLM-02',
    siteName: 'Tlemcen Plateau Mansourah',
    wilaya: 'Tlemcen',
    detectedAt: '38 min ago (09:16 UTC)',
    impactedSubscribers: 1380,
    vipAccountsCount: 19,
    revenueAtRiskDZD: 248500,
    priorityScore: 89,
    anomalyScore: -0.47,
    rootCauseDiagnosis: 'Transmission microwave fading on link TLM-MANS-HOP2 resulting in 5.2% packet drop rate and customer buffering. VoLTE MOS degraded to 2.85.',
    recommendedAction: 'Automated protection switchover to secondary fiber ring. Escalate field dispatch to tower technician.',
    itsmTicket: {
      platform: 'ServiceNow',
      externalTicketId: 'SNOW-INC0094812',
      dispatchedAt: 'Today, 09:20 UTC',
      syncStatus: 'SYNCHRONIZED',
      payloadSummary: 'P1 Telecom Critical Incident auto-created by TelecomAI Engine with impacted subscriber blast radius (1,380 users, 19 VIPs, 248.5k DZD).',
      assignedTeam: 'Field NOC & Transmission Maintenance West'
    }
  },
  {
    id: 'INC-2026-012',
    title: 'VoLTE MOS Drop & Jitter Degradation — Oran Coastal Sector',
    priority: 'P2-HIGH',
    status: 'MITIGATING',
    cellId: 'CELL-005',
    siteId: 'SITE-ORN-01',
    siteName: 'Oran Front de Mer / Port',
    wilaya: 'Oran',
    detectedAt: '1h 15m ago',
    impactedSubscribers: 520,
    vipAccountsCount: 12,
    revenueAtRiskDZD: 94000,
    priorityScore: 68,
    anomalyScore: 0.12,
    rootCauseDiagnosis: 'Adjacent channel RF interference causing SINR drop to 5.8 dB during heavy container crane movement. VoLTE voice call packets suffering 14ms jitter.',
    recommendedAction: 'Adjust PRB power allocation matrix and trigger dynamic inter-cell interference coordination (eICIC).',
    itsmTicket: {
      platform: 'Jira Service Management',
      externalTicketId: 'JSM-NOC-4421',
      dispatchedAt: 'Today, 08:45 UTC',
      syncStatus: 'ACKNOWLEDGED',
      payloadSummary: 'P2 High Telecom Service Issue: VoLTE degradation in Oran Port cluster.',
      assignedTeam: 'Radio Frequency Optimization (RFO) Team'
    }
  },
  {
    id: 'INC-2026-007',
    title: '5G NR Uplink Jitter Drift — Constantine Plateau',
    priority: 'P3-MEDIUM',
    status: 'INVESTIGATING',
    cellId: 'CELL-007',
    siteId: 'SITE-CST-04',
    siteName: 'Constantine Plateau Didouche',
    wilaya: 'Constantine',
    detectedAt: '2h 10m ago',
    impactedSubscribers: 310,
    vipAccountsCount: 8,
    revenueAtRiskDZD: 58000,
    priorityScore: 45,
    anomalyScore: 0.22,
    rootCauseDiagnosis: 'Marginal synchronization clock drift on gNodeB radio unit timing reference.',
    recommendedAction: 'Trigger remote PTP IEEE-1588 timing resync on site baseband unit.',
    itsmTicket: undefined
  },
  {
    id: 'INC-2026-004',
    title: 'Routine Carrier Configuration Warning — Blida South Sector',
    priority: 'P4-LOW',
    status: 'RESOLVED',
    cellId: 'CELL-006',
    siteId: 'SITE-BLD-01',
    siteName: 'Blida Centre Ville',
    wilaya: 'Blida',
    detectedAt: '4h 30m ago',
    impactedSubscribers: 95,
    vipAccountsCount: 2,
    revenueAtRiskDZD: 14000,
    priorityScore: 22,
    anomalyScore: 0.38,
    rootCauseDiagnosis: 'Transient optical SFP link warning during automated routine night maintenance.',
    recommendedAction: 'Telemetry stabilized; alarm auto-cleared.',
    itsmTicket: undefined
  }
];

export const INITIAL_SITES: SiteHierarchyNode[] = [
  {
    siteId: 'SITE-ALG-01',
    siteName: 'Algiers Port Maritime',
    wilaya: 'Algiers',
    siteType: '5G gNodeB Hub',
    carrierBand: 'n78 (3.5 GHz) + B3 (1800 MHz)',
    totalSectors: 3,
    cells: ['CELL-001', 'CELL-001B', 'CELL-001C'],
    healthScore: 99.4,
    status: 'normal',
    connectedUsers: 1420,
    backhaulLatencyMs: 24,
    activeAlarmsCount: 0
  },
  {
    siteId: 'SITE-ALG-03',
    siteName: 'Bab Ezzouar Technology Hub',
    wilaya: 'Algiers',
    siteType: 'Macro eNodeB',
    carrierBand: 'B1 (2100 MHz) + B7 (2600 MHz)',
    totalSectors: 3,
    cells: ['CELL-003', 'CELL-003B', 'CELL-003C'],
    healthScore: 68.2,
    status: 'anomaly',
    connectedUsers: 2840,
    backhaulLatencyMs: 97,
    activeAlarmsCount: 3
  },
  {
    siteId: 'SITE-ORN-01',
    siteName: 'Oran Front de Mer / Port',
    wilaya: 'Oran',
    siteType: 'Macro eNodeB',
    carrierBand: 'B3 (1800 MHz) + B20 (800 MHz)',
    totalSectors: 3,
    cells: ['CELL-002', 'CELL-005', 'CELL-005B'],
    healthScore: 88.5,
    status: 'warning',
    connectedUsers: 1811,
    backhaulLatencyMs: 38,
    activeAlarmsCount: 1
  },
  {
    siteId: 'SITE-TLM-02',
    siteName: 'Tlemcen Plateau Mansourah',
    wilaya: 'Tlemcen',
    siteType: 'Microwave Backhaul Hub',
    carrierBand: 'B3 (1800 MHz)',
    totalSectors: 2,
    cells: ['CELL-TLM-034', 'CELL-TLM-034B'],
    healthScore: 61.4,
    status: 'anomaly',
    connectedUsers: 1420,
    backhaulLatencyMs: 112,
    activeAlarmsCount: 2
  },
  {
    siteId: 'SITE-CST-04',
    siteName: 'Constantine Plateau Didouche',
    wilaya: 'Constantine',
    siteType: '5G gNodeB Hub',
    carrierBand: 'n78 (3.5 GHz)',
    totalSectors: 3,
    cells: ['CELL-004', 'CELL-007'],
    healthScore: 92.1,
    status: 'warning',
    connectedUsers: 1190,
    backhaulLatencyMs: 34,
    activeAlarmsCount: 1
  },
  {
    siteId: 'SITE-BLD-01',
    siteName: 'Blida Centre Ville',
    wilaya: 'Blida',
    siteType: 'Micro SmallCell',
    carrierBand: 'B7 (2600 MHz)',
    totalSectors: 2,
    cells: ['CELL-006'],
    healthScore: 98.6,
    status: 'normal',
    connectedUsers: 640,
    backhaulLatencyMs: 28,
    activeAlarmsCount: 0
  }
];

/**
 * Calculates the Customer Experience Score (CES / CEI: 0 - 100)
 * Weighted standard telecom SQM formula:
 * 35% Network Quality Index (from attached cell telemetry or defaults)
 * 30% Billing & Care Index (complaints & payment stability)
 * 20% Usage Health Index (usage drop & recharge cadence)
 * 15% Contract / Tenure Stability Fit
 */
export function calculateCustomerExperienceScore(
  customer: Customer,
  cell?: NetworkCell
): {
  score: number;
  band: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  breakdown: {
    networkQoE: number;
    billingCare: number;
    usageStability: number;
    tenureLoyalty: number;
  };
} {
  // 1. Network QoE (0 - 100)
  let networkQoE = 92;
  if (cell) {
    if (cell.status === 'anomaly') {
      networkQoE = Math.max(25, 90 - (cell.latencyMs * 0.45 + cell.packetLossPct * 8));
    } else if (cell.status === 'warning') {
      networkQoE = Math.max(50, 92 - (cell.latencyMs * 0.3 + cell.packetLossPct * 5));
    } else {
      networkQoE = Math.min(98, 100 - (cell.latencyMs * 0.15));
    }
  }

  // 2. Billing & Care Index (0 - 100)
  const complaintPenalty = (customer.complaints || 0) * 22;
  const billingCare = Math.max(15, 100 - complaintPenalty);

  // 3. Usage Stability Index (0 - 100)
  const dropPenalty = (customer.usageDeclinePct || 0) * 1.1;
  const usageStability = Math.max(20, 100 - dropPenalty);

  // 4. Tenure & Loyalty Fit (0 - 100)
  const tenureMonths = customer.tenureMonths || 12;
  const tenureLoyalty = Math.min(100, Math.max(35, 45 + tenureMonths * 1.5));

  // Weighted composition
  const total = Math.round(
    networkQoE * 0.35 +
    billingCare * 0.30 +
    usageStability * 0.20 +
    tenureLoyalty * 0.15
  );

  const score = Math.max(10, Math.min(99, total));

  let band: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' = 'GOOD';
  if (score >= 85) band = 'EXCELLENT';
  else if (score >= 70) band = 'GOOD';
  else if (score >= 50) band = 'FAIR';
  else band = 'POOR';

  return {
    score,
    band,
    breakdown: {
      networkQoE: Math.round(networkQoE),
      billingCare: Math.round(billingCare),
      usageStability: Math.round(usageStability),
      tenureLoyalty: Math.round(tenureLoyalty)
    }
  };
}

/**
 * Dispatches an incident to an external ITSM platform (ServiceNow, Jira, Remedy, eTOM)
 * Returns formatted payload and mock external ID for live operational demonstration.
 */
export function createMockITSMDispatch(
  incident: TelecomIncident,
  platform: ITSMPlatform,
  customNotes?: string
): {
  ticket: TelecomIncident['itsmTicket'];
  payload: Record<string, any>;
} {
  const prefixMap: Record<ITSMPlatform, string> = {
    'ServiceNow': 'SNOW-INC00',
    'Jira Service Management': 'JSM-NOC-',
    'BMC Remedy': 'RMDY-HD00',
    'eTOM REST Webhook': 'TMFORUM-INC-'
  };

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const externalTicketId = `${prefixMap[platform]}${randomNum}`;

  const payload = {
    standard: 'TM Forum eTOM GB921 / ITIL v4',
    sourceSystem: 'TelecomAI Operational Intelligence Platform v2.0',
    incidentId: incident.id,
    externalSystemTarget: platform,
    title: incident.title,
    severity: incident.priority,
    urgency: incident.priority === 'P1-CRITICAL' ? '1-High' : incident.priority === 'P2-HIGH' ? '2-Medium' : '3-Low',
    impact: incident.priority === 'P1-CRITICAL' ? '1-Extensive/Enterprise' : '2-Moderate',
    configurationItems: {
      cellId: incident.cellId,
      siteId: incident.siteId,
      siteName: incident.siteName,
      wilaya: incident.wilaya
    },
    blastRadius: {
      impactedSubscribers: incident.impactedSubscribers,
      vipAccountsCount: incident.vipAccountsCount,
      revenueAtRiskDZD: incident.revenueAtRiskDZD
    },
    aiDiagnostics: {
      priorityScore: incident.priorityScore,
      anomalyScore: incident.anomalyScore,
      rootCause: incident.rootCauseDiagnosis,
      recommendedAction: incident.recommendedAction
    },
    operatorNotes: customNotes || 'Automated dispatch via TelecomAI ITSM Connector.',
    dispatchedTimestamp: new Date().toISOString()
  };

  const ticket: TelecomIncident['itsmTicket'] = {
    platform,
    externalTicketId,
    dispatchedAt: 'Just now (' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')',
    syncStatus: 'SYNCHRONIZED',
    payloadSummary: `${incident.priority} Ticket created in ${platform}. Blast radius: ${incident.impactedSubscribers.toLocaleString()} subscribers (${incident.vipAccountsCount} VIPs).`,
    assignedTeam: incident.priority === 'P1-CRITICAL' ? 'Tier-3 Core & Transmission Operations' : 'Radio Access Optimization'
  };

  return { ticket, payload };
}
