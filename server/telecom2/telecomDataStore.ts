import { 
  Wilaya, 
  Site, 
  Cell, 
  Customer2, 
  Incident2, 
  CustomerExperienceIndex, 
  SimulationState,
  ScenarioType,
  ScenarioRequest,
  AuditLogEvent,
  AuditEventType,
  IncidentAnalytics
} from './types';

// ==========================================
// 1. WILAYAS (ALGERIAN REGIONS)
// ==========================================

export const WILAYAS: Wilaya[] = [
  { id: 'DZ-20', code: '20', name: 'Saida', region: 'High-Plateaux', subscriberCount: 142000, siteCount: 48 },
  { id: 'DZ-16', code: '16', name: 'Algiers', region: 'North', subscriberCount: 1840000, siteCount: 512 },
  { id: 'DZ-31', code: '31', name: 'Oran', region: 'West', subscriberCount: 920000, siteCount: 280 },
  { id: 'DZ-13', code: '13', name: 'Tlemcen', region: 'West', subscriberCount: 460000, siteCount: 142 },
  { id: 'DZ-25', code: '25', name: 'Constantine', region: 'East', subscriberCount: 680000, siteCount: 198 },
  { id: 'DZ-19', code: '19', name: 'Sétif', region: 'East', subscriberCount: 710000, siteCount: 210 },
];

// ==========================================
// 2. BASE STATION SITES (RAN TOWERS & HUBS)
// ==========================================

export const SITES: Site[] = [
  // Saïda Cluster (3 Sites, 7 Cells)
  {
    siteId: 'SITE-SAI-001',
    siteName: 'Saïda Centre Ville',
    wilaya: 'Saida',
    latitude: 34.8303,
    longitude: 0.1517,
    siteType: 'Macro eNodeB',
    carrierBand: 'B3 (1800 MHz) + B20 (800 MHz)',
    backhaulType: 'Microwave 10Gbps',
    cells: ['CELL-SAI-001A', 'CELL-SAI-001B'],
    status: 'anomaly',
    healthScore: 61,
  },
  {
    siteId: 'SITE-SAI-002',
    siteName: 'Saïda Nord Industrial Zone',
    wilaya: 'Saida',
    latitude: 34.8521,
    longitude: 0.1633,
    siteType: '5G gNodeB Hub',
    carrierBand: 'N78 (3.5 GHz) + B7 (2.6 GHz)',
    backhaulType: 'Fiber',
    cells: ['CELL-SAI-002A', 'CELL-SAI-002B', 'CELL-SAI-002C'],
    status: 'anomaly',
    healthScore: 58,
  },
  {
    siteId: 'SITE-SAI-003',
    siteName: 'El Hassasna Backhaul Hub',
    wilaya: 'Saida',
    latitude: 34.8105,
    longitude: 0.1389,
    siteType: 'Microwave Backhaul Hub',
    carrierBand: 'B3 (1800 MHz)',
    backhaulType: 'Microwave 10Gbps',
    cells: ['CELL-SAI-003A', 'CELL-SAI-003B'],
    status: 'anomaly',
    healthScore: 64,
  },

  // Algiers Cluster
  {
    siteId: 'SITE-ALG-001',
    siteName: 'Bab Ezzouar Cyberpark',
    wilaya: 'Algiers',
    latitude: 36.7139,
    longitude: 3.1855,
    siteType: '5G gNodeB Hub',
    carrierBand: 'N78 (3.5 GHz) + B3 (1800 MHz)',
    backhaulType: 'Fiber',
    cells: ['CELL-ALG-001A', 'CELL-ALG-001B', 'CELL-ALG-001C'],
    status: 'normal',
    healthScore: 98,
  },
  {
    siteId: 'SITE-ALG-002',
    siteName: 'Didouche Mourad Central',
    wilaya: 'Algiers',
    latitude: 36.7681,
    longitude: 3.0566,
    siteType: 'Macro eNodeB',
    carrierBand: 'B3 (1800 MHz) + B7 (2.6 GHz)',
    backhaulType: 'Fiber',
    cells: ['CELL-ALG-002A', 'CELL-ALG-002B'],
    status: 'normal',
    healthScore: 95,
  },

  // Oran Cluster
  {
    siteId: 'SITE-ORA-001',
    siteName: 'Akid Lotfi Marina',
    wilaya: 'Oran',
    latitude: 35.7198,
    longitude: -0.5897,
    siteType: '5G gNodeB Hub',
    carrierBand: 'N78 (3.5 GHz) + B3 (1800 MHz)',
    backhaulType: 'Fiber',
    cells: ['CELL-ORA-001A', 'CELL-ORA-001B'],
    status: 'normal',
    healthScore: 96,
  },

  // Tlemcen Cluster
  {
    siteId: 'SITE-TLM-001',
    siteName: 'Mansourah Citadel',
    wilaya: 'Tlemcen',
    latitude: 34.8712,
    longitude: -1.3411,
    siteType: 'Macro eNodeB',
    carrierBand: 'B3 (1800 MHz)',
    backhaulType: 'Microwave 10Gbps',
    cells: ['CELL-TLM-001A', 'CELL-TLM-001B'],
    status: 'warning',
    healthScore: 78,
  },
];

// ==========================================
// 3. CELLS (RADIO SECTORS & BASELINES)
// ==========================================

export const CELLS: Cell[] = [
  // Saïda 7 Cells (Incident Footprint)
  {
    cellId: 'CELL-SAI-001A',
    siteId: 'SITE-SAI-001',
    siteName: 'Saïda Centre Ville',
    wilaya: 'Saida',
    azimuth: 0,
    technology: '4G-LTE',
    carrierFreqMHz: 1800,
    status: 'anomaly',
    nominalBaseline: {
      latencyMs: 24.0,
      packetLossPct: 0.35,
      trafficMbps: 180.0,
      availabilityPct: 99.8,
      prbUtilizationPct: 52.0,
      callDropRatePct: 0.4,
      callSetupSuccessRatePct: 99.2,
    },
    currentTelemetry: {
      cellId: 'CELL-SAI-001A',
      timestamp: '2026-09-14T09:30:00Z',
      users: 218,
      latencyMs: 33.2,
      packetLossPct: 3.9,
      trafficMbps: 112.0,
      availabilityPct: 94.2,
      prbUtilizationPct: 88.0,
      callDropRatePct: 2.1,
      callSetupSuccessRatePct: 94.8,
    },
  },
  {
    cellId: 'CELL-SAI-001B',
    siteId: 'SITE-SAI-001',
    siteName: 'Saïda Centre Ville',
    wilaya: 'Saida',
    azimuth: 120,
    technology: '4G-LTE',
    carrierFreqMHz: 1800,
    status: 'anomaly',
    nominalBaseline: {
      latencyMs: 23.5,
      packetLossPct: 0.30,
      trafficMbps: 175.0,
      availabilityPct: 99.8,
      prbUtilizationPct: 50.0,
      callDropRatePct: 0.3,
      callSetupSuccessRatePct: 99.4,
    },
    currentTelemetry: {
      cellId: 'CELL-SAI-001B',
      timestamp: '2026-09-14T09:30:00Z',
      users: 194,
      latencyMs: 32.5,
      packetLossPct: 4.1,
      trafficMbps: 108.0,
      availabilityPct: 93.8,
      prbUtilizationPct: 89.5,
      callDropRatePct: 2.4,
      callSetupSuccessRatePct: 94.1,
    },
  },
  {
    cellId: 'CELL-SAI-002A',
    siteId: 'SITE-SAI-002',
    siteName: 'Saïda Nord Industrial Zone',
    wilaya: 'Saida',
    azimuth: 0,
    technology: '5G-NR',
    carrierFreqMHz: 3500,
    status: 'anomaly',
    nominalBaseline: {
      latencyMs: 14.0,
      packetLossPct: 0.20,
      trafficMbps: 350.0,
      availabilityPct: 99.9,
      prbUtilizationPct: 45.0,
      callDropRatePct: 0.2,
      callSetupSuccessRatePct: 99.6,
    },
    currentTelemetry: {
      cellId: 'CELL-SAI-002A',
      timestamp: '2026-09-14T09:30:00Z',
      users: 260,
      latencyMs: 19.3,
      packetLossPct: 2.2,
      trafficMbps: 210.0,
      availabilityPct: 95.0,
      prbUtilizationPct: 79.0,
      callDropRatePct: 1.8,
      callSetupSuccessRatePct: 96.0,
    },
  },
  {
    cellId: 'CELL-SAI-002B',
    siteId: 'SITE-SAI-002',
    siteName: 'Saïda Nord Industrial Zone',
    wilaya: 'Saida',
    azimuth: 120,
    technology: '5G-NR',
    carrierFreqMHz: 3500,
    status: 'anomaly',
    nominalBaseline: {
      latencyMs: 14.2,
      packetLossPct: 0.22,
      trafficMbps: 340.0,
      availabilityPct: 99.9,
      prbUtilizationPct: 46.0,
      callDropRatePct: 0.2,
      callSetupSuccessRatePct: 99.5,
    },
    currentTelemetry: {
      cellId: 'CELL-SAI-002B',
      timestamp: '2026-09-14T09:30:00Z',
      users: 245,
      latencyMs: 19.8,
      packetLossPct: 2.6,
      trafficMbps: 195.0,
      availabilityPct: 94.6,
      prbUtilizationPct: 82.0,
      callDropRatePct: 1.9,
      callSetupSuccessRatePct: 95.4,
    },
  },
  {
    cellId: 'CELL-SAI-002C',
    siteId: 'SITE-SAI-002',
    siteName: 'Saïda Nord Industrial Zone',
    wilaya: 'Saida',
    azimuth: 240,
    technology: '4G-LTE',
    carrierFreqMHz: 2600,
    status: 'anomaly',
    nominalBaseline: {
      latencyMs: 22.0,
      packetLossPct: 0.28,
      trafficMbps: 210.0,
      availabilityPct: 99.8,
      prbUtilizationPct: 48.0,
      callDropRatePct: 0.3,
      callSetupSuccessRatePct: 99.3,
    },
    currentTelemetry: {
      cellId: 'CELL-SAI-002C',
      timestamp: '2026-09-14T09:30:00Z',
      users: 172,
      latencyMs: 30.5,
      packetLossPct: 3.4,
      trafficMbps: 125.0,
      availabilityPct: 94.1,
      prbUtilizationPct: 84.0,
      callDropRatePct: 2.0,
      callSetupSuccessRatePct: 95.1,
    },
  },
  {
    cellId: 'CELL-SAI-003A',
    siteId: 'SITE-SAI-003',
    siteName: 'El Hassasna Backhaul Hub',
    wilaya: 'Saida',
    azimuth: 45,
    technology: '4G-LTE',
    carrierFreqMHz: 1800,
    status: 'anomaly',
    nominalBaseline: {
      latencyMs: 25.0,
      packetLossPct: 0.32,
      trafficMbps: 160.0,
      availabilityPct: 99.8,
      prbUtilizationPct: 47.0,
      callDropRatePct: 0.4,
      callSetupSuccessRatePct: 99.1,
    },
    currentTelemetry: {
      cellId: 'CELL-SAI-003A',
      timestamp: '2026-09-14T09:30:00Z',
      users: 105,
      latencyMs: 34.6,
      packetLossPct: 4.2,
      trafficMbps: 88.0,
      availabilityPct: 92.4,
      prbUtilizationPct: 86.0,
      callDropRatePct: 2.6,
      callSetupSuccessRatePct: 93.8,
    },
  },
  {
    cellId: 'CELL-SAI-003B',
    siteId: 'SITE-SAI-003',
    siteName: 'El Hassasna Backhaul Hub',
    wilaya: 'Saida',
    azimuth: 225,
    technology: '4G-LTE',
    carrierFreqMHz: 1800,
    status: 'anomaly',
    nominalBaseline: {
      latencyMs: 25.2,
      packetLossPct: 0.33,
      trafficMbps: 155.0,
      availabilityPct: 99.8,
      prbUtilizationPct: 49.0,
      callDropRatePct: 0.4,
      callSetupSuccessRatePct: 99.0,
    },
    currentTelemetry: {
      cellId: 'CELL-SAI-003B',
      timestamp: '2026-09-14T09:30:00Z',
      users: 90,
      latencyMs: 34.8,
      packetLossPct: 4.5,
      trafficMbps: 82.0,
      availabilityPct: 91.8,
      prbUtilizationPct: 87.5,
      callDropRatePct: 2.8,
      callSetupSuccessRatePct: 93.2,
    },
  },

  // Algiers Cells (Normal Benchmark)
  {
    cellId: 'CELL-ALG-001A',
    siteId: 'SITE-ALG-001',
    siteName: 'Bab Ezzouar Cyberpark',
    wilaya: 'Algiers',
    azimuth: 0,
    technology: '5G-NR',
    carrierFreqMHz: 3500,
    status: 'normal',
    nominalBaseline: {
      latencyMs: 12.0,
      packetLossPct: 0.15,
      trafficMbps: 450.0,
      availabilityPct: 99.95,
      prbUtilizationPct: 42.0,
      callDropRatePct: 0.1,
      callSetupSuccessRatePct: 99.8,
    },
    currentTelemetry: {
      cellId: 'CELL-ALG-001A',
      timestamp: '2026-09-14T09:30:00Z',
      users: 420,
      latencyMs: 12.4,
      packetLossPct: 0.18,
      trafficMbps: 442.0,
      availabilityPct: 99.9,
      prbUtilizationPct: 44.0,
      callDropRatePct: 0.1,
      callSetupSuccessRatePct: 99.7,
    },
  },
];

// ==========================================
// 4. SUBSCRIBERS / CUSTOMER REGISTRY
// ==========================================

// Seed a rich cohort of subscribers linked to these cells
export const CUSTOMERS_DB: Customer2[] = [
  // Saïda High Risk / Enterprise & VIP Cohort
  {
    customerId: 'CUST-SAI-001',
    name: 'Sonatrach Regional Base Saïda',
    wilaya: 'Saida',
    segment: 'Enterprise B2B',
    subscriptionType: 'Postpaid',
    planName: 'Enterprise Dedicated 100GB',
    monthlySpendDZD: 14500,
    tenureMonths: 36,
    complaints: 3,
    attachedCellId: 'CELL-SAI-001A',
    fallbackCellId: 'CELL-SAI-001B',
    baselineChurnRisk: 0.72,
    dataUsageGB: 88.4,
    callsCount: 640,
    rechargeFrequencyDays: 30,
  },
  {
    customerId: 'CUST-SAI-002',
    name: 'Dr. Amina Benali (Hospital Saïda)',
    wilaya: 'Saida',
    segment: 'VIP Priority',
    subscriptionType: 'Postpaid',
    planName: 'VIP Unlimited Gold',
    monthlySpendDZD: 6500,
    tenureMonths: 48,
    complaints: 2,
    attachedCellId: 'CELL-SAI-001A',
    fallbackCellId: 'CELL-SAI-002A',
    baselineChurnRisk: 0.65,
    dataUsageGB: 42.1,
    callsCount: 420,
    rechargeFrequencyDays: 30,
  },
  {
    customerId: 'CUST-SAI-003',
    name: 'Saïda Agro Logistics SARL',
    wilaya: 'Saida',
    segment: 'Enterprise B2B',
    subscriptionType: 'Postpaid',
    planName: 'Fleet M2M 50-Lines',
    monthlySpendDZD: 18000,
    tenureMonths: 18,
    complaints: 4,
    attachedCellId: 'CELL-SAI-002B',
    fallbackCellId: 'CELL-SAI-002C',
    baselineChurnRisk: 0.81,
    dataUsageGB: 120.5,
    callsCount: 890,
    rechargeFrequencyDays: 30,
  },
  {
    customerId: 'CUST-SAI-004',
    name: 'Karim Boukhatem',
    wilaya: 'Saida',
    segment: 'Consumer Postpaid',
    subscriptionType: 'Postpaid',
    planName: 'Haya Postpaid 2000',
    monthlySpendDZD: 2200,
    tenureMonths: 14,
    complaints: 2,
    attachedCellId: 'CELL-SAI-001B',
    fallbackCellId: 'CELL-SAI-003A',
    baselineChurnRisk: 0.68,
    dataUsageGB: 22.5,
    callsCount: 180,
    rechargeFrequencyDays: 30,
  },
  {
    customerId: 'CUST-SAI-005',
    name: 'Youcef Belkacem',
    wilaya: 'Saida',
    segment: 'Consumer Prepaid',
    subscriptionType: 'Prepaid',
    planName: 'Prepaid Djezzy Special 1500',
    monthlySpendDZD: 1500,
    tenureMonths: 8,
    complaints: 3,
    attachedCellId: 'CELL-SAI-002A',
    fallbackCellId: 'CELL-SAI-002B',
    baselineChurnRisk: 0.74,
    dataUsageGB: 14.8,
    callsCount: 95,
    rechargeFrequencyDays: 14,
  },
  {
    customerId: 'CUST-SAI-006',
    name: 'Nadia Mansouri',
    wilaya: 'Saida',
    segment: 'Consumer Postpaid',
    subscriptionType: 'Postpaid',
    planName: 'Gold 30GB',
    monthlySpendDZD: 3100,
    tenureMonths: 22,
    complaints: 1,
    attachedCellId: 'CELL-SAI-003B',
    fallbackCellId: 'CELL-SAI-003A',
    baselineChurnRisk: 0.55,
    dataUsageGB: 28.0,
    callsCount: 210,
    rechargeFrequencyDays: 30,
  },
  {
    customerId: 'CUST-SAI-007',
    name: 'Tariq Zerrouki',
    wilaya: 'Saida',
    segment: 'Consumer Prepaid',
    subscriptionType: 'Prepaid',
    planName: 'Prepaid Flexy 1000',
    monthlySpendDZD: 1200,
    tenureMonths: 6,
    complaints: 2,
    attachedCellId: 'CELL-SAI-002C',
    fallbackCellId: 'CELL-SAI-001A',
    baselineChurnRisk: 0.69,
    dataUsageGB: 11.2,
    callsCount: 85,
    rechargeFrequencyDays: 10,
  },
  {
    customerId: 'CUST-SAI-008',
    name: 'Clinique Al-Amel Saïda',
    wilaya: 'Saida',
    segment: 'Enterprise B2B',
    subscriptionType: 'Postpaid',
    planName: 'Healthcare Priority IP',
    monthlySpendDZD: 12000,
    tenureMonths: 29,
    complaints: 2,
    attachedCellId: 'CELL-SAI-001A',
    fallbackCellId: 'CELL-SAI-001B',
    baselineChurnRisk: 0.62,
    dataUsageGB: 65.0,
    callsCount: 480,
    rechargeFrequencyDays: 30,
  },

  // Algiers Benchmark Customers
  {
    customerId: 'CUST-ALG-001',
    name: 'Cevital Digital Services Algiers',
    wilaya: 'Algiers',
    segment: 'Enterprise B2B',
    subscriptionType: 'Postpaid',
    planName: 'Enterprise Gigabit 500GB',
    monthlySpendDZD: 45000,
    tenureMonths: 42,
    complaints: 0,
    attachedCellId: 'CELL-ALG-001A',
    fallbackCellId: 'CELL-ALG-001B',
    baselineChurnRisk: 0.12,
    dataUsageGB: 340.0,
    callsCount: 1200,
    rechargeFrequencyDays: 30,
  },
  {
    customerId: 'CUST-ALG-002',
    name: 'Sofia Merabet',
    wilaya: 'Algiers',
    segment: 'Consumer Postpaid',
    subscriptionType: 'Postpaid',
    planName: 'Postpaid Smart 3000',
    monthlySpendDZD: 3000,
    tenureMonths: 19,
    complaints: 0,
    attachedCellId: 'CELL-ALG-002A',
    fallbackCellId: 'CELL-ALG-002B',
    baselineChurnRisk: 0.18,
    dataUsageGB: 24.5,
    callsCount: 310,
    rechargeFrequencyDays: 30,
  },
  {
    customerId: 'CUST-ORA-001',
    name: 'Oran Port Terminal Logistics',
    wilaya: 'Oran',
    segment: 'Enterprise B2B',
    subscriptionType: 'Postpaid',
    planName: 'Enterprise Harbor 200GB',
    monthlySpendDZD: 28000,
    tenureMonths: 31,
    complaints: 1,
    attachedCellId: 'CELL-ORA-001A',
    fallbackCellId: 'CELL-ORA-001B',
    baselineChurnRisk: 0.22,
    dataUsageGB: 180.0,
    callsCount: 750,
    rechargeFrequencyDays: 30,
  },
  {
    customerId: 'CUST-TLM-001',
    name: 'Universite Abou Bekr Belkaid',
    wilaya: 'Tlemcen',
    segment: 'VIP Priority',
    subscriptionType: 'Postpaid',
    planName: 'Campus Fiber Backup 100GB',
    monthlySpendDZD: 16000,
    tenureMonths: 24,
    complaints: 1,
    attachedCellId: 'CELL-TLM-001A',
    fallbackCellId: 'CELL-TLM-001B',
    baselineChurnRisk: 0.38,
    dataUsageGB: 95.0,
    callsCount: 410,
    rechargeFrequencyDays: 30,
  },
];

// ==========================================
// 5. STATEFUL STORES & INCIDENTS DATABASE
// ==========================================

// Deep clone helper
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

let activeCells: Cell[] = deepClone(CELLS);
let activeSites: Site[] = deepClone(SITES);

let simulationState: SimulationState = {
  isActive: true, // Initially Saïda has active degradation for demonstration
  scenarioName: 'Saïda High-Plateaux Microwave Congestion',
  targetWilaya: 'Saida',
  degradedCellCount: 7,
  simulatedIncidentId: 'INC-0001',
  startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  currentAnomalyCount: 7,
};

// Initial Incidents List
let INCIDENTS_DB: Incident2[] = [
  {
    incident_id: 'INC-0001',
    title: 'Regional Network Degradation - Saïda Transport Backhaul',
    severity: 'HIGH',
    priority: 'P1',
    status: 'INVESTIGATING',
    detected_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    infrastructure: {
      wilaya: 'Saida',
      sites: 3,
      cells: 7,
      siteIds: ['SITE-SAI-001', 'SITE-SAI-002', 'SITE-SAI-003'],
      cellIds: [
        'CELL-SAI-001A',
        'CELL-SAI-001B',
        'CELL-SAI-002A',
        'CELL-SAI-002B',
        'CELL-SAI-002C',
        'CELL-SAI-003A',
        'CELL-SAI-003B',
      ],
    },
    network_impact: {
      latency_increase_pct: 38,
      packet_loss_increase_pct: 12,
    },
    customer_impact: {
      affected_customers: 1284,
      high_risk_customers: 237,
    },
    business_impact: {
      impact_score: 87,
      revenue_at_risk: 12500,
    },
    ai_analysis: {
      assessment:
        'High-volume congestion and packet drop anomaly detected across 7 radio sectors in Saida. Transport microwave backhaul latency elevated by 38% above nominal baseline (avg 29.2ms vs 21.1ms baseline) with a 12% packet loss elevation. Aggregate blast radius affects 1,284 subscribers (237 high churn risk) with 12,500 DZD monthly revenue exposure.',
      recommended_action:
        'Execute automated microwave link carrier failover to protection path on Site SITE-SAI-001. Adjust Remote Electrical Tilt (RET) by +2° down-tilt on sectors CELL-SAI-001A, CELL-SAI-001B, CELL-SAI-002A to offload traffic to adjacent micro-cells. Dispatch proactive SMS notification and credit 5GB goodwill data bonus to 237 vulnerable high-risk subscribers.',
      confidence: 0.84,
    },
    evidence: {
      detected_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      root_cause_indicators: [
        'Microwave link RSSI drop of -14 dBm detected on backhaul hop SITE-SAI-001 -> SITE-SAI-003',
        'PRB utilization pegged at 88% on sector carrier B3',
        'Elevation in RRC Connection Re-establishment failures (+42%) on 4G-LTE cells',
      ],
      telemetry_deltas: {
        latency_baseline_ms: 21.1,
        latency_current_ms: 29.2,
        latency_increase_pct: 38,
        packet_loss_baseline_pct: 0.29,
        packet_loss_current_pct: 3.56,
        packet_loss_increase_pct: 12,
      },
    },
    itsm_ticket: {
      ticket_id: 'INC-SNOW-89421',
      system: 'ServiceNow',
      dispatched_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'ASSIGNED',
    },
  },
  {
    incident_id: 'INC-0002',
    title: 'Minor Feeder Cable Drift - Tlemcen Mansourah Sector A',
    severity: 'LOW',
    priority: 'P3',
    status: 'INVESTIGATING',
    detected_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    infrastructure: {
      wilaya: 'Tlemcen',
      sites: 1,
      cells: 1,
      siteIds: ['SITE-TLM-001'],
      cellIds: ['CELL-TLM-001A'],
    },
    network_impact: {
      latency_increase_pct: 14,
      packet_loss_increase_pct: 3,
    },
    customer_impact: {
      affected_customers: 240,
      high_risk_customers: 28,
    },
    business_impact: {
      impact_score: 34,
      revenue_at_risk: 2800,
    },
    ai_analysis: {
      assessment:
        'VSWR RF antenna return loss elevated by 1.2 dB on Mansourah sector A. Localized packet discard observed without regional backhaul impact.',
      recommended_action:
        'Schedule preventative RF jumper connector replacement on SITE-TLM-001 during standard off-peak maintenance window.',
      confidence: 0.91,
    },
    evidence: {
      detected_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      root_cause_indicators: ['RF return loss VSWR 1.38 (threshold 1.25)'],
      telemetry_deltas: {
        latency_baseline_ms: 22.0,
        latency_current_ms: 25.1,
        latency_increase_pct: 14,
        packet_loss_baseline_pct: 0.35,
        packet_loss_current_pct: 1.05,
        packet_loss_increase_pct: 3,
      },
    },
  },
];

// ==========================================
// 6. HEALTH & CXS CALCULATION LOGIC
// ==========================================

/**
 * Transparent TelecomAI Prototype Network Health Calculation (0 - 100)
 * Evaluates deviation from nominal baseline across Latency, Packet Loss, Availability, and PRB Load.
 */
export function calculateCellHealthScore(cell: Cell): number {
  const current = cell.currentTelemetry;
  const baseline = cell.nominalBaseline;

  // Latency penalty: 0.5 point per 1% increase over baseline (capped at 30)
  const latDeltaPct = Math.max(0, ((current.latencyMs - baseline.latencyMs) / baseline.latencyMs) * 100);
  const latPenalty = Math.min(30, latDeltaPct * 0.4);

  // Packet loss penalty: 6 points per 1% absolute packet loss (capped at 35)
  const lossPenalty = Math.min(35, current.packetLossPct * 6.5);

  // Availability penalty: 5 points per 1% below 99.5% (capped at 25)
  const availDeficit = Math.max(0, 99.5 - current.availabilityPct);
  const availPenalty = Math.min(25, availDeficit * 4.5);

  // PRB congestion penalty: 1 point per 1% over 75% load (capped at 15)
  const prbExcess = Math.max(0, current.prbUtilizationPct - 75);
  const prbPenalty = Math.min(15, prbExcess * 0.8);

  const rawScore = 100 - (latPenalty + lossPenalty + availPenalty + prbPenalty);
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

/**
 * Customer Experience Index (CEI / CXS) (0 - 100)
 * Weighted synthesis of:
 * - Network QoE (35%)
 * - Billing & Care (30%)
 * - Usage Stability (20%)
 * - Tenure & Loyalty (15%)
 */
export function calculateCustomerExperienceIndex(
  customer: Customer2,
  servingCell?: Cell
): CustomerExperienceIndex & { riskFactors: string[]; shapAttribution: Record<string, number> } {
  // 1. Network QoE (0 - 100)
  let cellHealth = 95;
  if (servingCell) {
    cellHealth = calculateCellHealthScore(servingCell);
  }
  const networkQoE = cellHealth;

  // 2. Billing & Care (0 - 100)
  // Penalized by unresolved complaints: 20 pts per complaint
  const billingCare = Math.max(10, Math.round(100 - customer.complaints * 22));

  // 3. Usage Stability (0 - 100)
  // High data usage and active calls reflect healthy adoption
  const usageStability = Math.min(100, Math.round(Math.min(50, customer.dataUsageGB * 1.5) + Math.min(50, customer.callsCount / 10)));

  // 4. Tenure & Loyalty (0 - 100)
  const tenureLoyalty = Math.min(100, Math.round(customer.tenureMonths * 2.8));

  // Composite Score
  const score = Math.round(
    0.35 * networkQoE +
    0.30 * billingCare +
    0.20 * usageStability +
    0.15 * tenureLoyalty
  );

  let band: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' = 'EXCELLENT';
  if (score < 50) band = 'POOR';
  else if (score < 70) band = 'FAIR';
  else if (score < 85) band = 'GOOD';

  const riskFactors: string[] = [];
  if (servingCell && servingCell.status === 'anomaly') {
    riskFactors.push(`Attached to degraded sector ${servingCell.cellId} (${servingCell.wilaya})`);
  }
  if (customer.complaints >= 2) {
    riskFactors.push(`${customer.complaints} repeat customer care complaints logged`);
  }
  if (customer.tenureMonths < 12) {
    riskFactors.push(`New subscriber tenure (< 12 months)`);
  }
  if (customer.monthlySpendDZD > 10000) {
    riskFactors.push(`High ARPU Tier (${customer.monthlySpendDZD.toLocaleString()} DZD/mo)`);
  }

  // SHAP Attribution Simulation for explainability
  const shapAttribution = {
    'Network Degradation': servingCell?.status === 'anomaly' ? 0.32 : -0.15,
    'Repeat Complaints': customer.complaints * 0.12,
    'High Monthly Spend': customer.monthlySpendDZD > 5000 ? 0.08 : -0.05,
    'Contract Tenure': customer.tenureMonths > 24 ? -0.22 : 0.14,
    'Data Usage Consistency': customer.dataUsageGB > 30 ? -0.11 : 0.09,
  };

  return {
    score,
    band,
    breakdown: {
      networkQoE,
      billingCare,
      usageStability,
      tenureLoyalty,
    },
    riskFactors,
    shapAttribution,
  };
}

// ==========================================
// 7. PUBLIC SERVICE METHODS
// ==========================================

export function getNetworkOverview() {
  const allCells = activeCells;
  const anomalousCells = allCells.filter(c => c.status === 'anomaly');
  const warningCells = allCells.filter(c => c.status === 'warning');

  // Network health score: average cell health across all cells
  const sumHealth = allCells.reduce((acc, c) => acc + calculateCellHealthScore(c), 0);
  const avgHealth = Math.round(sumHealth / Math.max(1, allCells.length));

  // Calculate affected and high-risk subscribers
  const anomalousCellIds = anomalousCells.map(c => c.cellId);
  const affectedSubs = CUSTOMERS_DB.filter(
    c => anomalousCellIds.includes(c.attachedCellId) || (c.fallbackCellId && anomalousCellIds.includes(c.fallbackCellId))
  );

  const highRiskSubs = affectedSubs.filter(c => c.baselineChurnRisk >= 0.65 || c.complaints >= 2);

  // Derive total physical blast radius
  const totalConnectedUsersInAnomalous = anomalousCells.reduce((sum, c) => sum + c.currentTelemetry.users, 0);
  const affectedCustomersCount = totalConnectedUsersInAnomalous > 0 ? totalConnectedUsersInAnomalous : 1284;
  const highRiskCustomersCount = Math.round(affectedCustomersCount * (237 / 1284));

  // Regional breakdown
  const regionalBreakdown = WILAYAS.map(w => {
    const wilayaCells = allCells.filter(c => c.wilaya.toLowerCase() === w.name.toLowerCase());
    const wilayaAnomalies = wilayaCells.filter(c => c.status === 'anomaly').length;
    const wilayaHealth = wilayaCells.length > 0
      ? Math.round(wilayaCells.reduce((acc, c) => acc + calculateCellHealthScore(c), 0) / wilayaCells.length)
      : 98;

    return {
      wilaya: w.name,
      code: w.code,
      region: w.region,
      sites: w.siteCount,
      cells: wilayaCells.length,
      anomalies: wilayaAnomalies,
      healthScore: wilayaHealth,
      status: wilayaAnomalies > 0 ? 'ANOMALY' : wilayaHealth < 80 ? 'WARNING' : 'HEALTHY',
    };
  });

  return {
    network_health_score: avgHealth,
    active_sites: activeSites.length,
    active_cells: allCells.length,
    detected_anomalies: anomalousCells.length,
    warning_cells: warningCells.length,
    affected_customers: affectedCustomersCount,
    high_risk_customers: highRiskCustomersCount,
    revenue_at_risk_dzd: 12500,
    open_incidents_count: INCIDENTS_DB.filter(i => i.status !== 'RESOLVED').length,
    regional_breakdown: regionalBreakdown,
    synthetic_disclaimer: 'Synthetic telecom environment — illustrative data, not real operator statistics.',
    last_updated: new Date().toISOString(),
  };
}

export function getCells(filters?: { wilaya?: string; status?: string; siteId?: string }) {
  let list = activeCells.map(c => ({
    ...c,
    healthScore: calculateCellHealthScore(c),
  }));

  if (filters?.wilaya) {
    const wLower = filters.wilaya.toLowerCase();
    list = list.filter(c => c.wilaya.toLowerCase() === wLower);
  }
  if (filters?.status) {
    const sLower = filters.status.toLowerCase();
    list = list.filter(c => c.status.toLowerCase() === sLower);
  }
  if (filters?.siteId) {
    list = list.filter(c => c.siteId === filters.siteId);
  }

  return list;
}

export function getCellById(cellId: string) {
  const cell = activeCells.find(c => c.cellId.toUpperCase() === cellId.toUpperCase());
  if (!cell) return null;

  const healthScore = calculateCellHealthScore(cell);
  const attachedCustomers = CUSTOMERS_DB.filter(
    c => c.attachedCellId === cell.cellId || c.fallbackCellId === cell.cellId
  ).map(c => {
    const exp = calculateCustomerExperienceIndex(c, cell);
    return {
      ...c,
      experienceScore: exp.score,
      experienceBand: exp.band,
    };
  });

  const relatedIncidents = INCIDENTS_DB.filter(i => i.infrastructure.cellIds.includes(cell.cellId));

  return {
    cell: {
      ...cell,
      healthScore,
    },
    nominalBaseline: cell.nominalBaseline,
    currentTelemetry: cell.currentTelemetry,
    healthScore,
    attachedCustomers,
    relatedIncidents,
    synthetic_disclaimer: 'Synthetic telecom environment — illustrative data, not real operator statistics.',
  };
}

export function getCustomers(filters?: { wilaya?: string; highRisk?: boolean; cellId?: string }) {
  const cellMap = new Map<string, Cell>();
  activeCells.forEach(c => cellMap.set(c.cellId, c));

  let list = CUSTOMERS_DB.map(cust => {
    const servingCell = cellMap.get(cust.attachedCellId);
    const exp = calculateCustomerExperienceIndex(cust, servingCell);

    // Adjusted churn risk under active degradation
    let exposedChurnRisk = cust.baselineChurnRisk;
    if (servingCell && servingCell.status === 'anomaly') {
      exposedChurnRisk = Math.min(0.98, cust.baselineChurnRisk + 0.15);
    }

    return {
      customerId: cust.customerId,
      name: cust.name,
      wilaya: cust.wilaya,
      segment: cust.segment,
      subscriptionType: cust.subscriptionType,
      planName: cust.planName,
      monthlySpendDZD: cust.monthlySpendDZD,
      tenureMonths: cust.tenureMonths,
      complaints: cust.complaints,
      attachedCellId: cust.attachedCellId,
      experienceScore: exp.score,
      experienceBand: exp.band,
      churnRisk: Number(exposedChurnRisk.toFixed(2)),
      networkExposure: servingCell ? servingCell.status : 'normal',
      isHighRisk: exposedChurnRisk >= 0.65 || cust.complaints >= 2,
    };
  });

  if (filters?.wilaya) {
    const wLower = filters.wilaya.toLowerCase();
    list = list.filter(c => c.wilaya.toLowerCase() === wLower);
  }
  if (filters?.cellId) {
    list = list.filter(c => c.attachedCellId === filters.cellId);
  }
  if (filters?.highRisk !== undefined) {
    list = list.filter(c => c.isHighRisk === filters.highRisk);
  }

  return list;
}

export function getCustomerById(customerId: string) {
  const customer = CUSTOMERS_DB.find(c => c.customerId.toUpperCase() === customerId.toUpperCase());
  if (!customer) return null;

  const servingCell = activeCells.find(c => c.cellId === customer.attachedCellId);
  const fallbackCell = customer.fallbackCellId ? activeCells.find(c => c.cellId === customer.fallbackCellId) : null;
  const exp = calculateCustomerExperienceIndex(customer, servingCell);

  let exposedChurnRisk = customer.baselineChurnRisk;
  if (servingCell && servingCell.status === 'anomaly') {
    exposedChurnRisk = Math.min(0.98, customer.baselineChurnRisk + 0.15);
  }

  return {
    customer: {
      ...customer,
      churnRisk: Number(exposedChurnRisk.toFixed(2)),
      isHighRisk: exposedChurnRisk >= 0.65 || customer.complaints >= 2,
    },
    servingCell: servingCell ? {
      ...servingCell,
      healthScore: calculateCellHealthScore(servingCell),
    } : null,
    fallbackCell: fallbackCell ? {
      ...fallbackCell,
      healthScore: calculateCellHealthScore(fallbackCell),
    } : null,
    experience: exp,
    synthetic_disclaimer: 'Synthetic telecom environment — illustrative data, not real operator statistics.',
  };
}

export function getCustomerExperience(customerId: string) {
  const customer = CUSTOMERS_DB.find(c => c.customerId.toUpperCase() === customerId.toUpperCase());
  if (!customer) return null;

  const servingCell = activeCells.find(c => c.cellId === customer.attachedCellId);
  return {
    customerId: customer.customerId,
    customerName: customer.name,
    experience: calculateCustomerExperienceIndex(customer, servingCell),
    synthetic_disclaimer: 'Synthetic telecom environment — illustrative data, not real operator statistics.',
  };
}

export function getImpactSummary() {
  const anomalousCells = activeCells.filter(c => c.status === 'anomaly');
  const anomalousIds = anomalousCells.map(c => c.cellId);

  const affectedCustomers = CUSTOMERS_DB.filter(
    c => anomalousIds.includes(c.attachedCellId) || (c.fallbackCellId && anomalousIds.includes(c.fallbackCellId))
  );

  const highRiskCustomers = affectedCustomers.filter(c => c.baselineChurnRisk >= 0.65 || c.complaints >= 2);

  return {
    total_affected_cells: anomalousCells.length,
    total_affected_sites: new Set(anomalousCells.map(c => c.siteId)).size,
    total_affected_customers: 1284,
    total_high_risk_customers: 237,
    total_revenue_at_risk_dzd: 12500,
    impact_score: 87,
    cluster_hotspot: {
      wilaya: 'Saida',
      primary_cause: 'Microwave Backhaul Congestion',
      active_incidents: ['INC-0001'],
    },
    synthetic_disclaimer: 'Synthetic telecom environment — illustrative data, not real operator statistics.',
  };
}

export function getIncidents() {
  return INCIDENTS_DB;
}

export function getIncidentById(incidentId: string) {
  const inc = INCIDENTS_DB.find(i => i.incident_id.toUpperCase() === incidentId.toUpperCase());
  return inc || null;
}

export function createIncident(data: Partial<Incident2>): Incident2 {
  const count = INCIDENTS_DB.length + 1;
  const newId = `INC-${String(count).padStart(4, '0')}`;

  const newInc: Incident2 = {
    incident_id: data.incident_id || newId,
    title: data.title || 'Reported Network Degradation',
    severity: data.severity || 'MEDIUM',
    priority: data.priority || 'P2',
    status: data.status || 'NEW',
    detected_at: data.detected_at || new Date().toISOString(),
    infrastructure: data.infrastructure || {
      wilaya: 'Saida',
      sites: 1,
      cells: 1,
      siteIds: ['SITE-SAI-001'],
      cellIds: ['CELL-SAI-001A'],
    },
    network_impact: data.network_impact || {
      latency_increase_pct: 25,
      packet_loss_increase_pct: 6,
    },
    customer_impact: data.customer_impact || {
      affected_customers: 450,
      high_risk_customers: 65,
    },
    business_impact: data.business_impact || {
      impact_score: 60,
      revenue_at_risk: 5400,
    },
    ai_analysis: data.ai_analysis || {
      assessment: 'Operational incident created and tracked in TelecomAI 2.0 Incident Intelligence engine.',
      recommended_action: 'Dispatch tier-1 engineering diagnosis and verify microwave carrier telemetry.',
      confidence: 0.85,
    },
    evidence: data.evidence,
  };

  INCIDENTS_DB.unshift(newInc);
  return newInc;
}

export function updateIncident(incidentId: string, updates: Partial<Incident2>): Incident2 | null {
  const index = INCIDENTS_DB.findIndex(i => i.incident_id.toUpperCase() === incidentId.toUpperCase());
  if (index === -1) return null;

  INCIDENTS_DB[index] = {
    ...INCIDENTS_DB[index],
    ...updates,
  };

  return INCIDENTS_DB[index];
}

// ==========================================
// 8. SIMULATION ENGINE WORKFLOW
// ==========================================

export function simulateDegradation(wilaya: string = 'Saida'): { status: string; simulation: SimulationState } {
  // Degrade all cells in target wilaya
  activeCells = activeCells.map(c => {
    if (c.wilaya.toLowerCase() === wilaya.toLowerCase()) {
      return {
        ...c,
        status: 'anomaly' as const,
        currentTelemetry: {
          ...c.currentTelemetry,
          latencyMs: Number((c.nominalBaseline.latencyMs * 1.38).toFixed(1)),
          packetLossPct: Number((c.nominalBaseline.packetLossPct + 3.4).toFixed(1)),
          availabilityPct: 93.8,
          prbUtilizationPct: 88.5,
        },
      };
    }
    return c;
  });

  // Degrade sites in target wilaya
  activeSites = activeSites.map(s => {
    if (s.wilaya.toLowerCase() === wilaya.toLowerCase()) {
      return {
        ...s,
        status: 'anomaly' as const,
        healthScore: 58,
      };
    }
    return s;
  });

  // Re-open INC-0001 if closed
  const inc0001 = INCIDENTS_DB.find(i => i.incident_id === 'INC-0001');
  if (inc0001) {
    inc0001.status = 'INVESTIGATING';
  }

  simulationState = {
    isActive: true,
    scenarioName: `${wilaya} Transport Backhaul Congestion`,
    scenarioType: 'backhaul_degradation',
    severityLevel: 'CRITICAL',
    targetWilaya: wilaya,
    degradedCellCount: activeCells.filter(c => c.wilaya.toLowerCase() === wilaya.toLowerCase()).length,
    simulatedIncidentId: 'INC-0001',
    startedAt: new Date().toISOString(),
    currentAnomalyCount: activeCells.filter(c => c.status === 'anomaly').length,
  };

  // Add audit events reflecting the causal chain
  addAuditEvent(
    'SIMULATION_TRIGGERED',
    'SIMULATOR',
    `Injected ${wilaya} backhaul degradation scenario into live telemetry bus`,
    'HIGH'
  );
  addAuditEvent(
    'ANOMALY_DETECTED',
    'CELL-SAI-001A',
    `Isolation Forest detected +38% transport latency anomaly on Saïda cell cluster`,
    'CRITICAL'
  );
  addAuditEvent(
    'IMPACT_CALCULATED',
    'SAIDA_FOOTPRINT',
    `Spatial correlation identified 1,284 affected subscribers & 12,500 DZD revenue at risk`,
    'HIGH'
  );
  addAuditEvent(
    'INCIDENT_CREATED',
    'INC-0001',
    `Canonical incident INC-0001 created for 7 degraded radio sectors`,
    'CRITICAL'
  );
  addAuditEvent(
    'PRIORITY_ASSIGNED',
    'INC-0001',
    `P1-CRITICAL priority assigned (Score: 87/100, SLA: 60m)`,
    'CRITICAL'
  );
  addAuditEvent(
    'AI_ANALYSIS_COMPLETED',
    'INC-0001',
    `6-Question operational assessment generated (Confidence: 84%)`,
    'INFO'
  );

  return {
    status: 'Degradation simulation initiated successfully',
    simulation: simulationState,
  };
}

export function resetSimulation(): { status: string; simulation: SimulationState } {
  // Restore cells to nominal
  activeCells = deepClone(CELLS).map(c => ({
    ...c,
    status: 'normal' as const,
    currentTelemetry: {
      ...c.currentTelemetry,
      latencyMs: c.nominalBaseline.latencyMs,
      packetLossPct: c.nominalBaseline.packetLossPct,
      availabilityPct: c.nominalBaseline.availabilityPct,
      prbUtilizationPct: c.nominalBaseline.prbUtilizationPct,
    },
  }));

  activeSites = deepClone(SITES).map(s => ({
    ...s,
    status: 'normal' as const,
    healthScore: 98,
  }));

  // Mark INC-0001 as resolved
  const inc0001 = INCIDENTS_DB.find(i => i.incident_id === 'INC-0001');
  if (inc0001) {
    inc0001.status = 'RESOLVED';
  }

  simulationState = {
    isActive: false,
    scenarioName: 'Nominal Operations',
    scenarioType: 'nominal',
    severityLevel: 'LOW',
    targetWilaya: 'None',
    degradedCellCount: 0,
    simulatedIncidentId: '',
    startedAt: null,
    currentAnomalyCount: 0,
  };

  addAuditEvent(
    'SIMULATION_RESET',
    'SIMULATOR',
    'All cellular radio sectors, base stations and backhaul links restored to nominal baseline',
    'INFO'
  );

  return {
    status: 'Simulation reset: All network cells restored to nominal baseline',
    simulation: simulationState,
  };
}

export function getSimulationStatus(): SimulationState {
  return simulationState;
}

// ==========================================
// 8B. AUDIT & EVENT LOG STORE
// ==========================================

const formatTime = (date: Date) => {
  return date.toTimeString().split(' ')[0];
};

const initialTime = Date.now();

let AUDIT_LOGS: AuditLogEvent[] = [
  {
    id: 'evt-001',
    timestamp: new Date(initialTime - 12 * 60 * 1000).toISOString(),
    timeString: formatTime(new Date(initialTime - 12 * 60 * 1000)),
    eventType: 'ANOMALY_DETECTED',
    entityId: 'CELL-SAI-001A',
    details: 'Isolation Forest flagged latency spike (+38%) & PRB saturation (88.5%) on 1800MHz carrier',
    severity: 'HIGH',
    metadata: { latencyMs: 29.2, baselineMs: 21.1, packetLossPct: 3.56 },
  },
  {
    id: 'evt-002',
    timestamp: new Date(initialTime - 11 * 60 * 1000).toISOString(),
    timeString: formatTime(new Date(initialTime - 11 * 60 * 1000)),
    eventType: 'IMPACT_CALCULATED',
    entityId: 'SAIDA_CLUSTER',
    details: 'Topological correlation identified 1,284 affected subscribers (237 high churn risk) and 12,500 DZD revenue at risk',
    severity: 'HIGH',
    metadata: { affectedSubscribers: 1284, highRiskCount: 237, revenueAtRiskDZD: 12500 },
  },
  {
    id: 'evt-003',
    timestamp: new Date(initialTime - 11 * 60 * 1000).toISOString(),
    timeString: formatTime(new Date(initialTime - 11 * 60 * 1000)),
    eventType: 'INCIDENT_CREATED',
    entityId: 'INC-0001',
    details: 'Canonical incident INC-0001 created: Regional Network Degradation - Saïda (3 sites, 7 cells)',
    severity: 'CRITICAL',
    metadata: { sites: 3, cells: 7, wilaya: 'Saida' },
  },
  {
    id: 'evt-004',
    timestamp: new Date(initialTime - 10 * 60 * 1000).toISOString(),
    timeString: formatTime(new Date(initialTime - 10 * 60 * 1000)),
    eventType: 'PRIORITY_ASSIGNED',
    entityId: 'INC-0001',
    details: 'Priority scored as P1-CRITICAL (Score: 87/100, SLA: 60m) based on customer exposure & revenue at risk',
    severity: 'CRITICAL',
    metadata: { priority: 'P1', priorityScore: 87, slaMinutes: 60 },
  },
  {
    id: 'evt-005',
    timestamp: new Date(initialTime - 9 * 60 * 1000).toISOString(),
    timeString: formatTime(new Date(initialTime - 9 * 60 * 1000)),
    eventType: 'AI_ANALYSIS_COMPLETED',
    entityId: 'INC-0001',
    details: '6-Question root cause brief compiled with 84% confidence. Root cause: Microwave backhaul hop RSSI degradation',
    severity: 'INFO',
    metadata: { confidence: 0.84, primaryRootCause: 'Microwave Backhaul Congestion' },
  },
  {
    id: 'evt-006',
    timestamp: new Date(initialTime - 8 * 60 * 1000).toISOString(),
    timeString: formatTime(new Date(initialTime - 8 * 60 * 1000)),
    eventType: 'ITSM_WORK_ORDER_CREATED',
    entityId: 'INC-SNOW-89421',
    details: 'ServiceNow ticket dispatched to RAN_ENGINEERING_TIER_2 with eTOM/ITIL operational evidence payload',
    severity: 'INFO',
    metadata: { system: 'ServiceNow', ticketId: 'INC-SNOW-89421' },
  },
];

export function addAuditEvent(
  eventType: AuditEventType,
  entityId: string,
  details: string,
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO' = 'INFO',
  metadata?: Record<string, any>
): AuditLogEvent {
  const d = new Date();
  const newEvt: AuditLogEvent = {
    id: `evt-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    timestamp: d.toISOString(),
    timeString: formatTime(d),
    eventType,
    entityId,
    details,
    severity,
    metadata,
  };
  AUDIT_LOGS.unshift(newEvt);
  if (AUDIT_LOGS.length > 250) {
    AUDIT_LOGS = AUDIT_LOGS.slice(0, 250);
  }
  return newEvt;
}

export function getAuditEvents(limit: number = 50, filterType?: string): AuditLogEvent[] {
  let list = AUDIT_LOGS;
  if (filterType && filterType !== 'ALL') {
    list = list.filter(e => e.eventType === filterType);
  }
  return list.slice(0, limit);
}

// ==========================================
// 8C. MULTI-SCENARIO SIMULATOR
// ==========================================

export function simulateScenario(req: ScenarioRequest): { status: string; simulation: SimulationState } {
  const wilaya = req.wilaya || 'Saida';
  const severity = req.severity || 'CRITICAL';
  const scenarioType = req.scenario || 'backhaul_degradation';

  if (scenarioType === 'nominal') {
    return resetSimulation();
  }

  // Calculate severity multipliers
  const sevMultiplier = severity === 'CRITICAL' ? 1.5 : severity === 'HIGH' ? 1.25 : severity === 'MEDIUM' ? 1.1 : 1.05;

  activeCells = activeCells.map(c => {
    if (c.wilaya.toLowerCase() === wilaya.toLowerCase()) {
      let lat = c.nominalBaseline.latencyMs;
      let loss = c.nominalBaseline.packetLossPct;
      let avail = c.nominalBaseline.availabilityPct;
      let prb = c.nominalBaseline.prbUtilizationPct;

      switch (scenarioType) {
        case 'cell_congestion':
          prb = Math.min(96, Number((prb * 1.8 * sevMultiplier).toFixed(1)));
          lat = Number((lat * 1.25 * sevMultiplier).toFixed(1));
          loss = Number((loss + 2.1 * sevMultiplier).toFixed(1));
          break;
        case 'backhaul_degradation':
          lat = Number((lat * 1.38 * sevMultiplier).toFixed(1));
          loss = Number((loss + 3.4 * sevMultiplier).toFixed(1));
          avail = 93.8;
          prb = 88.5;
          break;
        case 'high_latency':
          lat = Number((lat * 1.65 * sevMultiplier).toFixed(1));
          loss = Number((loss + 1.2).toFixed(1));
          break;
        case 'packet_loss':
          loss = Number((loss + 4.8 * sevMultiplier).toFixed(1));
          lat = Number((lat * 1.18).toFixed(1));
          break;
        case 'site_outage':
          avail = 14.5;
          loss = 18.2;
          lat = 115.0;
          prb = 15.0;
          break;
        case 'regional_degradation':
          lat = Number((lat * 1.5 * sevMultiplier).toFixed(1));
          loss = Number((loss + 3.8 * sevMultiplier).toFixed(1));
          avail = 89.0;
          prb = 92.0;
          break;
      }

      return {
        ...c,
        status: 'anomaly' as const,
        currentTelemetry: {
          ...c.currentTelemetry,
          latencyMs: lat,
          packetLossPct: loss,
          availabilityPct: avail,
          prbUtilizationPct: prb,
        },
      };
    }
    return c;
  });

  activeSites = activeSites.map(s => {
    if (s.wilaya.toLowerCase() === wilaya.toLowerCase()) {
      return {
        ...s,
        status: 'anomaly' as const,
        healthScore: scenarioType === 'site_outage' ? 24 : 58,
      };
    }
    return s;
  });

  const scenarioTitles: Record<ScenarioType, string> = {
    nominal: 'Nominal Operations',
    cell_congestion: `${wilaya} Sector PRB Capacity Saturation`,
    backhaul_degradation: `${wilaya} Microwave Backhaul Congestion`,
    high_latency: `${wilaya} Transport Jitter & Latency Surge`,
    packet_loss: `${wilaya} RF Jumper Drift & Frame Discard`,
    site_outage: `${wilaya} Primary Rectifier Power Outage`,
    regional_degradation: `${wilaya} Metropolitan Cluster Degradation`,
  };

  const scenarioTitle = scenarioTitles[scenarioType] || `${wilaya} Injected Degradation`;

  // Update or re-open incident
  const inc0001 = INCIDENTS_DB.find(i => i.incident_id === 'INC-0001');
  if (inc0001) {
    inc0001.status = 'INVESTIGATING';
    inc0001.title = `Regional Incident: ${scenarioTitle}`;
    inc0001.priority = severity === 'CRITICAL' ? 'P1' : severity === 'HIGH' ? 'P2' : 'P3';
  }

  simulationState = {
    isActive: true,
    scenarioName: scenarioTitle,
    scenarioType,
    severityLevel: severity,
    targetWilaya: wilaya,
    degradedCellCount: activeCells.filter(c => c.wilaya.toLowerCase() === wilaya.toLowerCase()).length,
    simulatedIncidentId: 'INC-0001',
    startedAt: new Date().toISOString(),
    currentAnomalyCount: activeCells.filter(c => c.status === 'anomaly').length,
  };

  // Add the sequence of causal audit events
  addAuditEvent('SIMULATION_TRIGGERED', 'SCENARIO_CENTER', `Scenario launched: ${scenarioTitle} (${severity} severity)`, 'HIGH');
  addAuditEvent('ANOMALY_DETECTED', `RAN-${wilaya.toUpperCase()}`, `Anomaly vector detected across ${wilaya} radio carrier sectors`, 'HIGH');
  addAuditEvent('IMPACT_CALCULATED', 'BLAST_RADIUS', `Impact evaluated: 1,284 subscribers exposed, 12,500 DZD revenue at risk`, 'HIGH');
  addAuditEvent('INCIDENT_CREATED', 'INC-0001', `Operational incident registered: ${scenarioTitle}`, 'CRITICAL');
  addAuditEvent('PRIORITY_ASSIGNED', 'INC-0001', `Assigned priority ${simulationState.severityLevel === 'CRITICAL' ? 'P1' : 'P2'} based on revenue & VIP weighting`, 'CRITICAL');
  addAuditEvent('AI_ANALYSIS_COMPLETED', 'INC-0001', `Generated root-cause diagnosis and engineering mitigation playbook`, 'INFO');
  addAuditEvent('RECOMMENDATION_GENERATED', 'PLAYBOOK', `Recommended: Dynamic carrier offload and automated link failover`, 'INFO');

  return {
    status: `Scenario '${scenarioTitle}' initiated successfully`,
    simulation: simulationState,
  };
}

// ==========================================
// 8D. INCIDENT ANALYTICS SERVICE
// ==========================================

export function getIncidentAnalytics(): IncidentAnalytics {
  const openCount = INCIDENTS_DB.filter(i => i.status !== 'RESOLVED').length;

  return {
    totalIncidents: 14,
    openIncidents: openCount,
    resolvedIncidents: 14 - openCount,
    mttrMinutes: {
      overall: 58,
      p1: 42,
      p2: 115,
      p3: 240,
      p4: 480,
    },
    severityDistribution: {
      p1: INCIDENTS_DB.filter(i => i.priority === 'P1').length,
      p2: INCIDENTS_DB.filter(i => i.priority === 'P2').length + 2,
      p3: INCIDENTS_DB.filter(i => i.priority === 'P3').length + 4,
      p4: 2,
    },
    dailyTrend: [
      { date: '2026-09-09', day: 'Wed', incidents: 1, affectedCustomers: 320, revenueRiskDZD: 3100 },
      { date: '2026-09-10', day: 'Thu', incidents: 2, affectedCustomers: 540, revenueRiskDZD: 5200 },
      { date: '2026-09-11', day: 'Fri', incidents: 1, affectedCustomers: 180, revenueRiskDZD: 1900 },
      { date: '2026-09-12', day: 'Sat', incidents: 3, affectedCustomers: 890, revenueRiskDZD: 8400 },
      { date: '2026-09-13', day: 'Sun', incidents: 2, affectedCustomers: 620, revenueRiskDZD: 6100 },
      { date: '2026-09-14', day: 'Mon', incidents: 2, affectedCustomers: 710, revenueRiskDZD: 7200 },
      { date: '2026-09-15', day: 'Tue', incidents: openCount + 1, affectedCustomers: 1284, revenueRiskDZD: 12500 },
    ],
    topProblematicSites: [
      { siteId: 'SITE-SAI-001', siteName: 'Saïda Centre Ville', wilaya: 'Saida', incidentCount: 4, healthScore: 61 },
      { siteId: 'SITE-TLM-001', siteName: 'Mansourah Central', wilaya: 'Tlemcen', incidentCount: 3, healthScore: 78 },
      { siteId: 'SITE-ORA-001', siteName: 'Akid Lotfi Marina', wilaya: 'Oran', incidentCount: 2, healthScore: 92 },
      { siteId: 'SITE-SAI-003', siteName: 'El Hassasna Backhaul Hub', wilaya: 'Saida', incidentCount: 2, healthScore: 64 },
    ],
    topProblematicCells: [
      { cellId: 'CELL-SAI-001A', siteName: 'Saïda Centre Ville', wilaya: 'Saida', anomalyFrequency: 5, lastIncident: 'INC-0001' },
      { cellId: 'CELL-SAI-002A', siteName: 'Saïda Nord Ind Zone', wilaya: 'Saida', anomalyFrequency: 3, lastIncident: 'INC-0001' },
      { cellId: 'CELL-TLM-001A', siteName: 'Mansourah Central', wilaya: 'Tlemcen', anomalyFrequency: 3, lastIncident: 'INC-0002' },
      { cellId: 'CELL-ORA-001A', siteName: 'Akid Lotfi Marina', wilaya: 'Oran', anomalyFrequency: 2, lastIncident: 'INC-0003' },
    ],
    incidentsByWilaya: [
      { wilaya: 'Saida', count: 5, p1Count: 2, status: 'ELEVATED' },
      { wilaya: 'Tlemcen', count: 3, p1Count: 0, status: 'MODERATE' },
      { wilaya: 'Oran', count: 3, p1Count: 1, status: 'MONITORED' },
      { wilaya: 'Algiers', count: 2, p1Count: 0, status: 'STABLE' },
      { wilaya: 'Constantine', count: 1, p1Count: 0, status: 'STABLE' },
    ],
    recurringRootCauses: [
      { type: 'Microwave Backhaul Transport Congestion', count: 6, pctOfTotal: 43 },
      { type: 'VSWR RF Antenna Return Loss Drift', count: 3, pctOfTotal: 21 },
      { type: 'Baseband PRB Physical Layer Saturation', count: 3, pctOfTotal: 21 },
      { type: 'Fiber Transport Intermediate Jitter', count: 2, pctOfTotal: 15 },
    ],
  };
}

// ==========================================
// 9. MODEL PERFORMANCE SPECS
// ==========================================

export function getModelPerformanceSpecs() {
  return {
    models: [
      {
        modelName: 'Gradient Boosting Classifier',
        task: 'Customer Churn Risk Prediction & Retention Advisory',
        role: 'Champion Production Model',
        isChampion: true,
        metrics: {
          rocAuc: 0.961,
          f1Score: 0.741,
          precision: 0.766,
          recall: 0.718,
          accuracy: 0.892,
        },
        features: [
          'Monthly Spend DZD (ARPU)',
          'Data Usage GB & Quota Depletion Rate',
          'Tenure in Months',
          'Customer Care Repeat Complaints',
          'Voice Call Volume',
          'Network Exposure (Cell Latency / Packet Loss)',
          'Recharge Frequency Days',
          'Subscription Tier (Prepaid / Postpaid / VIP / B2B)',
        ],
        methodology:
          'Trained under 5-fold stratified cross-validation on synthetic behavioral telecom subscriber dataset. Local explainability provided via SHAP TreeExplainer attributions.',
        limitations:
          'Evaluated on synthetic subscriber distribution. Live operator deployments require calibration against billing records and local market retention patterns.',
      },
      {
        modelName: 'Unsupervised Isolation Forest',
        task: 'Cellular Radio Access Network (RAN) Anomaly Detection',
        role: 'Real-time Telemetry Ingestion',
        isChampion: false,
        metrics: {
          contaminationRate: 0.05,
          f1Score: 0.88,
          precision: 0.86,
          recall: 0.90,
          decisionThreshold: -0.12,
        },
        features: [
          'Transport RTT Latency (ms)',
          'Packet Loss Ratio (%)',
          'Throughput Deviation (Mbps)',
          'Carrier Availability Index (%)',
          'Active Connected UEs',
          'PRB Resource Block Utilization (%)',
        ],
        methodology:
          'Unsupervised partitioning trees isolating anomalous multi-dimensional telemetry vectors without relying on ground-truth labels during training.',
        limitations:
          'Baseline drift during major sporting or cultural events requires dynamic baseline adjustment to avoid false positives.',
      },
    ],
    benchmarkComparison: [
      { name: 'Gradient Boosting', rocAuc: 0.961, f1: 0.741, precision: 0.766, recall: 0.718 },
      { name: 'Random Forest', rocAuc: 0.948, f1: 0.722, precision: 0.745, recall: 0.701 },
      { name: 'Logistic Regression', rocAuc: 0.832, f1: 0.612, precision: 0.635, recall: 0.591 },
      { name: 'Decision Tree', rocAuc: 0.815, f1: 0.589, precision: 0.602, recall: 0.578 },
    ],
    synthetic_disclaimer: 'Synthetic telecom environment — illustrative data, not real operator statistics.',
  };
}

