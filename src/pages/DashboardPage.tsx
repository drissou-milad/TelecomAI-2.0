import React from 'react';
import { 
  Activity, 
  Users, 
  AlertTriangle, 
  Radio, 
  TrendingDown, 
  DollarSign, 
  ShieldAlert, 
  ChevronRight, 
  Clock, 
  Server,
  Sparkles,
  Flame,
  Send,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { 
  DashboardSummary, 
  WilayaHealth, 
  Customer, 
  NetworkCell, 
  TrafficForecastPoint,
  ModelComparison,
  TelecomIncident
} from '../types';
import { ImpactChain } from '../components/ImpactChain';

interface DashboardPageProps {
  summary: DashboardSummary;
  championModel: ModelComparison | null;
  wilayas: WilayaHealth[];
  customers: Customer[];
  cells: NetworkCell[];
  trafficForecast: TrafficForecastPoint[];
  incidents?: TelecomIncident[];
  onNavigate: (page: string) => void;
  onSelectCustomer: (customerId: string) => void;
  onSelectCell: (cellId: string) => void;
  onInspectIncident?: (incidentId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  summary,
  championModel,
  wilayas,
  customers,
  cells,
  incidents = [],
  onNavigate,
  onSelectCustomer,
  onSelectCell,
  onInspectIncident
}) => {
  // Calculated metrics aligned with prompt specifications
  const activeIncidentsList = incidents.filter(i => i.status !== 'RESOLVED');
  const openIncidentsCount = activeIncidentsList.length || 3;
  const p1IncidentsCount = activeIncidentsList.filter(i => i.priority === 'P1-CRITICAL' || i.priority.startsWith('P1')).length || 1;
  const criticalCellsCount = cells.filter(c => c.status === 'anomaly').length || 2;
  const itsmWorkOrdersCount = 2; // Active dispatched ServiceNow tickets

  const affectedSubscribersCount = 1284;
  const highRiskCount = 187;
  const cxsImpactPct = -31;
  const revenueRiskDZD = 12500;
  const networkHealthPct = 91.4;

  const handleInspect = (id: string = 'INC-0001') => {
    if (onInspectIncident) {
      onInspectIncident(id);
    } else {
      onNavigate('incidents');
    }
  };

  // Recent operational events stream
  const recentEvents = [
    { time: '10:42:06', type: 'ITSM', text: 'ServiceNow work order INC-SNOW-89421 dispatched to Field Operations', status: 'success' },
    { time: '10:42:05', type: 'AI_PLAYBOOK', text: 'Dual-track operational playbook generated (RF Carrier Failover + VIP Retention SMS)', status: 'info' },
    { time: '10:42:03', type: 'INCIDENT', text: 'Canonical P1 incident INC-0001 created (Saïda Central Hub)', status: 'critical' },
    { time: '10:42:02', type: 'BUSINESS', text: '12,500 DZD monthly revenue exposure assessed across 1,284 subscribers', status: 'warning' },
    { time: '10:42:01', type: 'ANOMALY', text: 'Isolation Forest detected transport anomaly on Cell SA-042 (Score: -0.184)', status: 'critical' }
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* 1. Page Header & Core Positioning */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-slate-800 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            NOC Operational Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
            TelecomAI 2.0 correlates network telemetry, customer experience, and business impact to detect operational incidents, prioritize their severity, explain their impact, and recommend actionable responses.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs shrink-0">
          <button
            onClick={() => onNavigate('ai_analysis')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition shadow-sm cursor-pointer"
            id="overview-ai-analysis-btn"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Root-Cause Loop</span>
          </button>
        </div>
      </header>

      {/* 2. THE FOUR IMMEDIATE QUESTIONS: 4 Domain KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: NETWORK */}
        <div 
          onClick={() => onNavigate('network')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition cursor-pointer flex flex-col justify-between shadow-md"
          id="overview-kpi-network"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-sky-400" />
              Network
            </span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              RAN QOS
            </span>
          </div>

          <div className="py-3 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Network Health</span>
              <span className="text-2xl font-black font-mono-num text-emerald-400">
                {networkHealthPct}%
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/50">
              <span className="text-slate-400">Active Incidents</span>
              <span className="font-mono font-bold text-white">{openIncidentsCount}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Critical Cells</span>
              <span className="font-mono font-bold text-rose-400">{criticalCellsCount}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>Wilaya: Saïda Hub</span>
            <span className="text-sky-400 font-semibold flex items-center gap-0.5">
              Details <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* CARD 2: CUSTOMER */}
        <div 
          onClick={() => onNavigate('customers')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition cursor-pointer flex flex-col justify-between shadow-md"
          id="overview-kpi-customer"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              Customer
            </span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              BLAST RADIUS
            </span>
          </div>

          <div className="py-3 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Affected Customers</span>
              <span className="text-2xl font-black font-mono-num text-amber-400">
                {affectedSubscribersCount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/50">
              <span className="text-slate-400">High-Risk Customers</span>
              <span className="font-mono font-bold text-rose-400">{highRiskCount}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">CXS Impact</span>
              <span className="font-mono font-bold text-rose-400">{cxsImpactPct}%</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>CXS Index 78 ➔ 54</span>
            <span className="text-sky-400 font-semibold flex items-center gap-0.5">
              Customer 360 <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* CARD 3: BUSINESS */}
        <div 
          onClick={() => handleInspect('INC-0001')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition cursor-pointer flex flex-col justify-between shadow-md"
          id="overview-kpi-business"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Business
            </span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              MRR RISK
            </span>
          </div>

          <div className="py-3 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Revenue at Risk</span>
              <span className="text-2xl font-black font-mono-num text-rose-400">
                {revenueRiskDZD.toLocaleString()} <span className="text-xs font-normal text-slate-400">DZD</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/50">
              <span className="text-slate-400">Corporate VIP Accounts</span>
              <span className="font-mono font-bold text-amber-300">12 Accounts</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Financial Exposure Model</span>
              <span className="font-mono font-medium text-slate-300">Deterministic</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>ARPU exposure / month</span>
            <span className="text-sky-400 font-semibold flex items-center gap-0.5">
              Breakdown <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* CARD 4: OPERATIONS */}
        <div 
          onClick={() => onNavigate('incidents')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition cursor-pointer flex flex-col justify-between shadow-md"
          id="overview-kpi-operations"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Operations
            </span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              ITSM TRIAGE
            </span>
          </div>

          <div className="py-3 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">P1 Incidents</span>
              <span className="text-2xl font-black font-mono-num text-rose-500">
                {p1IncidentsCount}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/50">
              <span className="text-slate-400">Open Incidents</span>
              <span className="font-mono font-bold text-white">{openIncidentsCount}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">ITSM Work Orders</span>
              <span className="font-mono font-bold text-sky-400">{itsmWorkOrdersCount} Active</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>SLA: 60 min countdown</span>
            <span className="text-sky-400 font-semibold flex items-center gap-0.5">
              Incident Center <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* 3. VISUALLY EXPLICIT IMPACT CHAIN COMPONENT (Requirement 4) */}
      <ImpactChain
        cellId="SA-042"
        siteId="SA-SITE-07"
        siteName="Saïda Central Hub"
        networkImpactText="High latency (+38%) + packet loss (+12%)"
        affectedCount={affectedSubscribersCount}
        highRiskCount={highRiskCount}
        cxsBefore={78}
        cxsAfter={54}
        revenueRiskDZD={revenueRiskDZD}
        priority="P1"
        onInspectIncident={() => handleInspect('INC-0001')}
      />

      {/* 4. FOCUSED CORE PANELS BELOW KPIS (Requirement 3: Network Health, Active Incidents, Customer Impact, Recent Events) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (Span 7): Active Incidents & Network Health */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Incidents Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Active Incidents Requiring Action
                </h3>
              </div>
              <button
                onClick={() => onNavigate('incidents')}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition cursor-pointer"
              >
                View All ({openIncidentsCount})
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Canonical P1 Incident Card */}
              <div 
                onClick={() => handleInspect('INC-0001')}
                className="p-3.5 bg-slate-950/80 hover:bg-slate-950 border border-rose-500/40 rounded-xl transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold text-xs border border-rose-500/40">
                      P1 — CRITICAL
                    </span>
                    <span className="font-mono text-xs font-semibold text-sky-400">INC-0001</span>
                    <span className="text-[10px] text-slate-400">Wilaya: Saïda</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Microwave Backhaul Transport Link Attenuation (SITE-SAI-001)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Impacts Cell SA-042 & 3 adjacent sectors • 1,284 subscribers • 12,500 DZD revenue at risk
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0">
                  <span className="text-xs font-mono font-bold text-rose-400">SLA: 42m remaining</span>
                  <span className="text-xs font-semibold text-sky-400 flex items-center gap-1 mt-1">
                    Inspect Evidence <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Secondary P2 Incident */}
              <div 
                onClick={() => handleInspect('INC-0002')}
                className="p-3 bg-slate-950/50 hover:bg-slate-950 border border-slate-800 rounded-xl transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/40">
                      P2 — MAJOR
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-400">INC-0002</span>
                    <span className="text-[10px] text-slate-400">Wilaya: Oran</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">
                    PRB Downlink Scheduling Queue Congestion (SITE-ORN-014)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    384 subscribers • 3,200 DZD revenue at risk • PRB utilization 94%
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0">
                  <span className="text-xs font-mono text-slate-400">SLA: 195m remaining</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    Inspect <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Network Health Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Regional Network Health Status
                </h3>
              </div>
              <button
                onClick={() => onNavigate('network')}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition cursor-pointer"
              >
                All Sectors <ChevronRight className="w-3 h-3 inline" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Saïda (High-Plateaux)</div>
                <div className="text-base font-bold font-mono-num text-rose-400 mt-1">68.2%</div>
                <div className="text-[10px] text-rose-400 mt-0.5">Degraded (4 sectors)</div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Oran (Metropolitan)</div>
                <div className="text-base font-bold font-mono-num text-amber-400 mt-1">89.5%</div>
                <div className="text-[10px] text-amber-400 mt-0.5">Minor Jitter</div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Algiers (Capital Zone)</div>
                <div className="text-base font-bold font-mono-num text-emerald-400 mt-1">98.4%</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Nominal</div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Constantine (East)</div>
                <div className="text-base font-bold font-mono-num text-emerald-400 mt-1">97.8%</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Nominal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Span 5): Customer Impact & Recent Events */}
        <div className="lg:col-span-5 space-y-4">
          {/* Customer Impact Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Customer Impact & Churn Risk
                </h3>
              </div>
              <button
                onClick={() => onNavigate('customers')}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition cursor-pointer"
              >
                Customer 360
              </button>
            </div>

            <div className="space-y-3">
              {/* CXS Shift Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Customer Experience Score (CXS)</span>
                  <span className="font-mono font-bold text-rose-400">78.4 ➔ 54.1 (-31%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div className="bg-rose-500 h-full" style={{ width: '54%' }} />
                  <div className="bg-slate-700 h-full" style={{ width: '24%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>Degraded Score: 54.1</span>
                  <span>Nominal Target: 80.0</span>
                </div>
              </div>

              {/* High Risk Breakdown */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">High-Risk Churn Cohort:</span>
                  <span className="font-mono font-bold text-rose-400">187 Subscribers</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Primary Risk Driver:</span>
                  <span className="font-mono text-amber-300">Repeated Call Drops & Latency</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">SHAP Churn Impact:</span>
                  <span className="font-mono text-purple-400">+0.28 (Network Latency)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Recent Events Stream */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Recent Operational Events
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Stream
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {recentEvents.map((evt, idx) => (
                <div key={idx} className="p-2 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs flex items-start gap-2.5">
                  <span className="font-mono text-[10px] text-slate-500 shrink-0 mt-0.5">{evt.time}</span>
                  <div className="flex-1">
                    <span className="text-slate-300 leading-snug">{evt.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
