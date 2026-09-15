import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Radio, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ExternalLink, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  Workflow, 
  Clock, 
  Layers, 
  Activity, 
  Sliders, 
  Search,
  Filter,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  TelecomIncident, 
  NetworkCustomerImpact, 
  QoSMetrics, 
  ITSMPlatform, 
  IncidentPriority,
  Customer,
  NetworkCell
} from '../types';
import { 
  createMockITSMDispatch 
} from '../data/operationsData';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell as RechartsCell 
} from 'recharts';

interface OperationsPageProps {
  incidents: TelecomIncident[];
  impacts: NetworkCustomerImpact[];
  qosMetrics: QoSMetrics;
  customers: Customer[];
  cells: NetworkCell[];
  onUpdateIncident: (updated: TelecomIncident) => void;
  onNavigate: (page: string) => void;
  onSelectCell: (cellId: string) => void;
  onSelectCustomer: (customerId: string) => void;
}

export const OperationsPage: React.FC<OperationsPageProps> = ({
  incidents,
  impacts,
  qosMetrics,
  customers,
  cells,
  onUpdateIncident,
  onNavigate,
  onSelectCell,
  onSelectCustomer
}) => {
  const [activeTab, setActiveTab] = useState<'incidents' | 'sqm_qos' | 'correlation' | 'itsm_connector'>('incidents');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<TelecomIncident>(incidents[0] || null);
  
  // ITSM Dispatch Modal State
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchTargetIncident, setDispatchTargetIncident] = useState<TelecomIncident | null>(null);
  const [targetPlatform, setTargetPlatform] = useState<ITSMPlatform>('ServiceNow');
  const [customOperatorNotes, setCustomOperatorNotes] = useState('');
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);
  const [lastDispatchedPayload, setLastDispatchedPayload] = useState<Record<string, any> | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Filter incidents
  const filteredIncidents = incidents.filter(inc => {
    if (priorityFilter === 'ALL') return true;
    return inc.priority === priorityFilter;
  });

  const p1Count = incidents.filter(i => i.priority === 'P1-CRITICAL' && i.status !== 'RESOLVED').length;
  const totalImpactedUsers = incidents.reduce((acc, i) => i.status !== 'RESOLVED' ? acc + i.impactedSubscribers : acc, 0);
  const totalRevenueAtRisk = incidents.reduce((acc, i) => i.status !== 'RESOLVED' ? acc + i.revenueAtRiskDZD : acc, 0);

  const handleOpenDispatchModal = (incident: TelecomIncident) => {
    setDispatchTargetIncident(incident);
    setTargetPlatform(incident.itsmTicket?.platform || 'ServiceNow');
    setCustomOperatorNotes('');
    setIsDispatchModalOpen(true);
  };

  const handleConfirmDispatch = async () => {
    if (!dispatchTargetIncident) return;

    try {
      const res = await fetch('/api/integrations/itsm/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident_id: dispatchTargetIncident.id,
          title: dispatchTargetIncident.title,
          priority: dispatchTargetIncident.priority === 'P1-CRITICAL' ? 'P1' : 'P2',
          severity: dispatchTargetIncident.priority === 'P1-CRITICAL' ? 'CRITICAL' : 'HIGH',
          affected_infrastructure: {
            wilaya: dispatchTargetIncident.wilaya,
            sites: 1,
            cells: 1,
            cell_ids: [dispatchTargetIncident.cellId],
            site_ids: [dispatchTargetIncident.siteId]
          },
          customer_impact: {
            affected_customers: dispatchTargetIncident.impactedSubscribers,
            high_risk_customers: Math.round(dispatchTargetIncident.impactedSubscribers * 0.18)
          },
          business_impact: {
            impact_score: dispatchTargetIncident.priorityScore,
            revenue_at_risk_dzd: dispatchTargetIncident.revenueAtRiskDZD
          },
          ai_assessment: dispatchTargetIncident.rootCauseDiagnosis,
          recommended_action: dispatchTargetIncident.recommendedAction,
          confidence: 0.86,
          system: targetPlatform === 'Jira Service Management' ? 'Jira' : 'ServiceNow',
          operator_notes: customOperatorNotes
        })
      });

      if (res.ok) {
        const ticketData = await res.json();
        const updatedIncident: TelecomIncident = {
          ...dispatchTargetIncident,
          status: 'DISPATCHED_TO_ITSM',
          itsmTicket: {
            platform: targetPlatform,
            externalTicketId: ticketData.ticket_id,
            dispatchedAt: new Date().toLocaleTimeString(),
            syncStatus: 'SYNCHRONIZED',
            payloadSummary: `Dispatched to ${ticketData.system} with SLA target ${ticketData.sla_target_hours || 1}h`,
            assignedTeam: ticketData.assigned_group || 'NOC-Transport-Tier2'
          }
        };

        onUpdateIncident(updatedIncident);
        setSelectedIncident(updatedIncident);
        setLastDispatchedPayload(ticketData);
        setDispatchSuccessMsg(`Successfully dispatched to ${targetPlatform} (Ticket ID: ${ticketData.ticket_id})`);
        setTimeout(() => {
          setIsDispatchModalOpen(false);
          setDispatchSuccessMsg(null);
        }, 2000);
        return;
      }
    } catch (err) {
      console.warn('Backend ITSM dispatch error, falling back to prototype connector:', err);
    }

    // Fallback prototype dispatch if offline
    const { ticket, payload } = createMockITSMDispatch(dispatchTargetIncident, targetPlatform, customOperatorNotes);
    const updatedIncident: TelecomIncident = {
      ...dispatchTargetIncident,
      status: 'DISPATCHED_TO_ITSM',
      itsmTicket: ticket
    };

    onUpdateIncident(updatedIncident);
    setSelectedIncident(updatedIncident);
    setLastDispatchedPayload(payload);
    setDispatchSuccessMsg(`Successfully dispatched to ${targetPlatform} (Ticket ID: ${ticket?.externalTicketId})`);
    
    setTimeout(() => {
      setIsDispatchModalOpen(false);
      setDispatchSuccessMsg(null);
    }, 2500);
  };

  const handleCopyPayload = (payload: any) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Top Operations Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between pb-3 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Operational Intelligence & ITSM Connector
            </h1>
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold">
              TelecomAI 2.0
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono-num font-semibold">
              Synthetic Demonstrator
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Service Quality Management (SQM), Network-to-Customer Correlation & Automated ITSM Incident Dispatch (All data synthetic/prototype-derived)
          </p>
        </div>

        {/* Action badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded font-mono-num text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ITSM Bridge: Active</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded font-mono-num text-rose-400 font-bold">
            <span>{p1Count} P1 Incident{p1Count !== 1 ? 's' : ''} Open</span>
          </div>
        </div>
      </header>

      {/* Top Level Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Customer Experience Score (CES) */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Customer Experience Index
              </span>
              <span className="text-[9px] text-slate-500 font-mono">SYNTHETIC CEI</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              GOOD (84.2%)
            </span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl font-bold text-white font-mono-num">84.2</span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono-num">
            <span>VoLTE: {qosMetrics.volteMos} MOS</span>
            <span>Video QoE: {qosMetrics.videoQoE}%</span>
          </div>
        </div>

        {/* Metric 2: Impacted Subscribers */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Incident Blast Radius
              </span>
              <span className="text-[9px] text-slate-500 font-mono">SYNTHETIC CORRELATION</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
              Active Alerts
            </span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl font-bold text-rose-400 font-mono-num">
              {totalImpactedUsers.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">subscribers</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono-num">
            <span>VIP Accounts: 73</span>
            <span className="text-rose-400">High Churn: 244</span>
          </div>
        </div>

        {/* Metric 3: Revenue at Risk */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Monthly Revenue at Risk
              </span>
              <span className="text-[9px] text-slate-500 font-mono">SIMULATED EXPOSURE (DZD)</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
              RAN Impact
            </span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl font-bold text-amber-400 font-mono-num">
              {(totalRevenueAtRisk / 1000).toFixed(1)}k
            </span>
            <span className="text-xs text-slate-400">DZD / mo</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono-num">
            <span>Avg Risk / Cell: 186k</span>
            <span className="text-amber-400 font-semibold">+38% Churn Risk</span>
          </div>
        </div>

        {/* Metric 4: ITSM Dispatch Bridge */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                External ITSM Bridge
              </span>
              <span className="text-[9px] text-slate-500 font-mono">STANDARDIZED SCHEMAS</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
              eTOM / ITIL
            </span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-2xl font-bold text-sky-400 font-mono-num">ServiceNow</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono-num">
            <span>Jira • Remedy • Webhook</span>
            <button
              onClick={() => setActiveTab('itsm_connector')}
              className="text-sky-400 underline hover:text-sky-300 cursor-pointer"
            >
              Config
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'incidents'
              ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Incident Intelligence ({incidents.length})</span>
          {p1Count > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {p1Count} P1
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('correlation')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'correlation'
              ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Network → Customer Impact Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('sqm_qos')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'sqm_qos'
              ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>QoS & Service Quality Management</span>
        </button>

        <button
          onClick={() => setActiveTab('itsm_connector')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'itsm_connector'
              ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>ITSM Connector Testbed</span>
        </button>
      </div>

      {/* TAB 1: Incident Intelligence & AI Prioritization */}
      {activeTab === 'incidents' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Incident Queue (Span 5) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  AI-Prioritized Incidents
                </h3>
                <span className="text-[11px] text-slate-500">
                  Sorted by Combined Blast Radius & Severity
                </span>
              </div>

              {/* Priority filter */}
              <div className="flex items-center gap-1 text-[10px]">
                {['ALL', 'P1-CRITICAL', 'P2-HIGH'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={`px-2 py-1 rounded font-semibold cursor-pointer transition-colors ${
                      priorityFilter === p
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p === 'P1-CRITICAL' ? 'P1 Only' : p === 'P2-HIGH' ? 'P2 Only' : 'All'}
                  </button>
                ))}
              </div>
            </div>

            {/* Incidents List */}
            <div className="space-y-2.5 overflow-y-auto max-h-[580px] pr-1">
              {filteredIncidents.map(inc => {
                const isSelected = selectedIncident?.id === inc.id;
                const isP1 = inc.priority === 'P1-CRITICAL';
                const isP2 = inc.priority === 'P2-HIGH';
                const isDispatched = inc.status === 'DISPATCHED_TO_ITSM';

                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-sky-500 shadow-md ring-1 ring-sky-500/50'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono-num ${
                          isP1 
                            ? 'bg-rose-500 text-white' 
                            : isP2 
                            ? 'bg-amber-500 text-slate-950' 
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {inc.priority.split('-')[0]}
                        </span>
                        <span className="font-mono text-xs font-bold text-white">{inc.id}</span>
                        <span className="text-[10px] text-slate-400 font-mono-num">{inc.wilaya}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-sky-400 font-mono-num">
                          Score: {inc.priorityScore}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1.5">
                      {inc.title}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-num pt-1 border-t border-slate-800/80">
                      <span>👥 {inc.impactedSubscribers.toLocaleString()} Users ({inc.vipAccountsCount} VIP)</span>
                      <span>💰 {(inc.revenueAtRiskDZD / 1000).toFixed(0)}k DZD</span>
                    </div>

                    {isDispatched && inc.itsmTicket && (
                      <div className="mt-2 text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-between font-mono-num">
                        <span>✓ In {inc.itsmTicket.platform}</span>
                        <span>{inc.itsmTicket.externalTicketId}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Incident & ITSM Dispatch Cockpit (Span 7) */}
          {selectedIncident && (
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      selectedIncident.priority === 'P1-CRITICAL'
                        ? 'bg-rose-500 text-white'
                        : 'bg-amber-500 text-slate-950 font-bold'
                    }`}>
                      {selectedIncident.priority}
                    </span>
                    <span className="text-xs text-slate-400 font-mono-num">{selectedIncident.id}</span>
                    <span className="text-xs text-slate-500">• Detected {selectedIncident.detectedAt}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    {selectedIncident.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDispatchModal(selectedIncident)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch to ITSM</span>
                  </button>
                </div>
              </div>

              {/* Blast Radius Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-num">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Cell CI Target</span>
                  <button
                    onClick={() => {
                      onSelectCell(selectedIncident.cellId);
                      onNavigate('network');
                    }}
                    className="text-sky-400 font-bold underline hover:text-sky-300 text-left"
                  >
                    {selectedIncident.cellId}
                  </button>
                  <span className="text-[10px] text-slate-500 block">{selectedIncident.siteId}</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Subscribers Impacted</span>
                  <span className="text-rose-400 font-bold text-sm">
                    {selectedIncident.impactedSubscribers.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{selectedIncident.vipAccountsCount} VIP Accounts</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Revenue at Risk</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {(selectedIncident.revenueAtRiskDZD / 1000).toFixed(0)}k DZD
                  </span>
                  <span className="text-[10px] text-slate-400 block">Monthly recurring</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">AI Priority Score</span>
                  <span className="text-white font-bold text-sm">
                    {selectedIncident.priorityScore} / 100
                  </span>
                  <span className="text-[10px] text-emerald-400 block">Anomaly: {selectedIncident.anomalyScore}</span>
                </div>
              </div>

              {/* Root Cause & Diagnostic */}
              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3GPP / AI Telemetry Root Cause Analysis</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedIncident.rootCauseDiagnosis}
                </p>
              </div>

              {/* AI Recommended Operations Action */}
              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Recommended NOC Remediation</span>
                </div>
                <pre className="text-xs text-slate-300 font-sans whitespace-pre-line leading-relaxed">
                  {selectedIncident.recommendedAction}
                </pre>
              </div>

              {/* AI Operational Assessment — 6 Core Operator Questions */}
              <div className="p-4 bg-slate-950 rounded-lg border border-sky-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      AI Operational Intelligence Synthesis (6 Core Inquiries)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Confidence: 86%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/90 p-3 rounded border border-slate-800/80">
                    <span className="text-sky-400 font-bold block mb-1">1. What happened?</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Microwave backhaul degradation and PRB resource saturation detected on site {selectedIncident.siteName} ({selectedIncident.wilaya}). Physical link degradation caused severe queueing latency.
                    </p>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded border border-slate-800/80">
                    <span className="text-amber-400 font-bold block mb-1">2. Why is it important?</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Incident exceeds P1 threshold: {(selectedIncident.revenueAtRiskDZD / 1000).toFixed(0)}k DZD monthly revenue at risk, violating operator SLA targets with elevated risk of subscriber churn.
                    </p>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded border border-slate-800/80">
                    <span className="text-rose-400 font-bold block mb-1">3. Who is affected?</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {selectedIncident.impactedSubscribers.toLocaleString()} subscribers in {selectedIncident.wilaya}, including {selectedIncident.vipAccountsCount} enterprise VIP accounts and heavy mobile data consumers.
                    </p>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded border border-slate-800/80">
                    <span className="text-emerald-400 font-bold block mb-1">4. What evidence supports this?</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      RAN telemetry deltas: Latency surged +38% above 42ms baseline, packet loss spiked to 12.8%, and radio beam utilization reached 88% capacity.
                    </p>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded border border-slate-800/80">
                    <span className="text-purple-400 font-bold block mb-1">5. What should operations investigate next?</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      1. Check bit error rate (BER) on microwave modem ODU. 2. Verify optical path alignment. 3. Execute temporary traffic offload to adjacent secondary carriers.
                    </p>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded border border-slate-800/80">
                    <span className="text-cyan-400 font-bold block mb-1">6. Model Confidence Factors</span>
                    <div className="text-[11px] text-slate-300 space-y-1">
                      <div className="flex justify-between">
                        <span>RAN Telemetry Anomaly:</span>
                        <span className="font-mono text-white">92% weight</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subscriber Blast Radius:</span>
                        <span className="font-mono text-white">84% weight</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Historical Pattern Match:</span>
                        <span className="font-mono text-white">82% weight</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active ITSM Status if Dispatched */}
              {selectedIncident.itsmTicket && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-300">
                        Synchronized with {selectedIncident.itsmTicket.platform}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {selectedIncident.itsmTicket.externalTicketId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {selectedIncident.itsmTicket.payloadSummary}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono-num">
                    <span>Assigned: {selectedIncident.itsmTicket.assignedTeam}</span>
                    <span>Dispatched: {selectedIncident.itsmTicket.dispatchedAt}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Network -> Customer Impact Cross-Correlation */}
      {activeTab === 'correlation' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-400" />
                  Network Degraded Cells → Subscriber Impact Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time cross-correlation connecting radio network anomalies with subscriber churn risk, VIP accounts, and revenue impact.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-slate-800 text-sky-400 rounded font-mono-num border border-slate-700">
                {impacts.length} High-Impact Cells Analyzed
              </span>
            </div>

            {/* Impact Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="pb-2.5 font-semibold">CELL & WILAYA</th>
                    <th className="pb-2.5 font-semibold">TELEMETRY DEGRADATION</th>
                    <th className="pb-2.5 font-semibold text-center">IMPACTED USERS</th>
                    <th className="pb-2.5 font-semibold text-center">HIGH CHURN</th>
                    <th className="pb-2.5 font-semibold text-center">VIP ACCOUNTS</th>
                    <th className="pb-2.5 font-semibold text-right">REVENUE AT RISK</th>
                    <th className="pb-2.5 font-semibold text-right">CHURN UPLIFT</th>
                    <th className="pb-2.5 font-semibold text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {impacts.map(imp => {
                    const isAnomaly = imp.status === 'anomaly';
                    return (
                      <tr key={imp.cellId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-mono">
                          <button
                            onClick={() => {
                              onSelectCell(imp.cellId);
                              onNavigate('network');
                            }}
                            className="text-sky-400 font-bold hover:underline block text-left"
                          >
                            {imp.cellId}
                          </button>
                          <span className="text-[10px] text-slate-400 block font-sans">
                            {imp.siteName} ({imp.wilaya})
                          </span>
                        </td>

                        <td className="py-3 max-w-xs">
                          <span className="text-slate-300 font-medium block">
                            {imp.primaryDegradation}
                          </span>
                          <span className="text-[10px] text-rose-400 block font-mono-num">
                            {imp.correlatedComplaints} correlated care complaints (48h)
                          </span>
                        </td>

                        <td className="py-3 text-center font-mono-num font-bold text-white">
                          {imp.impactedSubscribers.toLocaleString()}
                        </td>

                        <td className="py-3 text-center font-mono-num text-rose-400 font-bold">
                          {imp.highRiskSubscribers}
                        </td>

                        <td className="py-3 text-center font-mono-num text-amber-400 font-bold">
                          {imp.vipAccountsCount} VIP
                        </td>

                        <td className="py-3 text-right font-mono-num font-bold text-white">
                          {(imp.revenueAtRiskDZD / 1000).toFixed(0)}k DZD
                        </td>

                        <td className="py-3 text-right font-mono-num font-bold text-rose-400">
                          +{imp.churnRiskUpliftPct}%
                        </td>

                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              const relatedInc = incidents.find(i => i.cellId === imp.cellId);
                              if (relatedInc) {
                                setSelectedIncident(relatedInc);
                                setActiveTab('incidents');
                              } else {
                                onSelectCell(imp.cellId);
                                onNavigate('network');
                              }
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            View Incident
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Strategic Insight Box */}
            <div className="mt-4 p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3">
              <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">Correlation Insight: </strong>
                Cross-correlating subscriber complaints with radio telemetry reveals that <strong>78% of subscriber churn</strong> in Algiers North and Tlemcen was preceded by &gt;3 persistent cell latency spikes over a 14-day window. Resolving radio bottlenecks directly halts subscriber attrition.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Service Quality Management (QoS / SQM) */}
      {activeTab === 'sqm_qos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* VoLTE MOS */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  VoLTE Voice Call Quality (MOS)
                </span>
                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-3xl font-bold text-emerald-400 font-mono-num">
                    {qosMetrics.volteMos}
                  </span>
                  <span className="text-xs text-slate-500">/ 5.0 (ITU-T P.800)</span>
                </div>
              </div>
              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800 font-mono-num">
                <div className="flex justify-between">
                  <span>Call Drop Rate (DCR):</span>
                  <span className="text-emerald-400 font-bold">{qosMetrics.dropCallRatePct}% (Target &lt; 0.8%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Call Setup Time:</span>
                  <span className="text-white">1.8s</span>
                </div>
              </div>
            </div>

            {/* Mobile Video QoE */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Mobile Video Streaming QoE
                </span>
                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-3xl font-bold text-sky-400 font-mono-num">
                    {qosMetrics.videoQoE}%
                  </span>
                  <span className="text-xs text-emerald-400">Excellent</span>
                </div>
              </div>
              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800 font-mono-num">
                <div className="flex justify-between">
                  <span>Initial Buffering:</span>
                  <span className="text-white">1.1 sec</span>
                </div>
                <div className="flex justify-between">
                  <span>Stall Event Ratio:</span>
                  <span className="text-emerald-400 font-bold">0.82%</span>
                </div>
              </div>
            </div>

            {/* SLA Compliance */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Enterprise & Postpaid SLA Compliance
                </span>
                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-3xl font-bold text-white font-mono-num">
                    {qosMetrics.slaCompliancePct}%
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">Within SLA</span>
                </div>
              </div>
              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800 font-mono-num">
                <div className="flex justify-between">
                  <span>PRB Congestion Rate:</span>
                  <span className="text-amber-400 font-bold">{qosMetrics.prbCongestionPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Round-Trip Latency:</span>
                  <span className="text-white">{qosMetrics.webLatencyMs} ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wilaya SQM Comparison Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Regional Service Quality Index by Wilaya
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { wilaya: 'Algiers', score: 86.4, latency: 28 },
                  { wilaya: 'Oran', score: 88.2, latency: 31 },
                  { wilaya: 'Constantine', score: 84.1, latency: 34 },
                  { wilaya: 'Tlemcen', score: 71.5, latency: 54 },
                  { wilaya: 'Sétif', score: 91.0, latency: 26 },
                  { wilaya: 'Annaba', score: 85.3, latency: 32 },
                  { wilaya: 'Blida', score: 89.4, latency: 27 },
                  { wilaya: 'Batna', score: 87.0, latency: 33 }
                ]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="wilaya" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[50, 100]} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="score" name="SQM Quality Index %" fill="#38bdf8" radius={[4, 4, 0, 0]}>
                    {/* Highlight Tlemcen as lower */}
                    {['Algiers', 'Oran', 'Constantine', 'Tlemcen', 'Sétif', 'Annaba', 'Blida', 'Batna'].map((entry) => (
                      <RechartsCell 
                        key={entry} 
                        fill={entry === 'Tlemcen' ? '#f43f5e' : entry === 'Sétif' ? '#10b981' : '#38bdf8'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ITSM Connector Architecture & Testbed */}
      {activeTab === 'itsm_connector' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Workflow className="w-5 h-5 text-sky-400" />
              <span>ITSM Connector Integration Hub</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              TelecomAI does not compete with your enterprise ITSM — it acts as an intelligent upstream feeder, translating raw network anomalies and subscriber churn risk into prioritized operational tickets.
            </p>
          </div>

          {/* Architecture flow diagram */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
            <pre className="text-sky-300 leading-relaxed">
{`                TELECOMAI PLATFORM
                        │
       ┌────────────────┼────────────────┐
       ↓                ↓                ↓
   Network           Customer          Incident
 Intelligence       Experience        Management
  (RAN & QoS)        (CES & Churn)     (AI Prioritization)
       │                │                │
       └────────────────┼────────────────┘
                        ↓
                  ITSM CONNECTOR
         (Payload Transform • Blast Radius)
                        │
         ┌──────────────┼──────────────┐
         ↓              ↓              ↓
     ServiceNow        Jira         BMC Remedy /
    (Table API)     Service Desk   eTOM Webhook`}
            </pre>
          </div>

          {/* Interactive Trigger Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Supported Platforms & Protocols
              </h4>
              <ul className="text-xs space-y-2 text-slate-300">
                <li className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="font-semibold text-white">ServiceNow (ITIL v4)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    REST Table API
                  </span>
                </li>
                <li className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="font-semibold text-white">Atlassian Jira Service Management</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    Jira Cloud / Data Center REST
                  </span>
                </li>
                <li className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="font-semibold text-white">BMC Remedy AR System</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    HPD:IncidentInterface
                  </span>
                </li>
                <li className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="font-semibold text-white">TM Forum eTOM Standard Webhook</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold">
                    TMF621 Trouble Ticket API
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Simulate Incident Webhook Dispatch
              </h4>
              <p className="text-xs text-slate-400">
                Test sending a simulated payload for P1 Bab Ezzouar incident directly to your ITSM connector mock:
              </p>
              <button
                onClick={() => handleOpenDispatchModal(incidents[0])}
                className="w-full py-2.5 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Test Dispatch Payload Modal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISPATCH TO ITSM MODAL */}
      {isDispatchModalOpen && dispatchTargetIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-sky-400" />
                  <span>Dispatch Incident to External ITSM</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Incident: {dispatchTargetIncident.id} ({dispatchTargetIncident.wilaya})
                </span>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Target ITSM selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target ITSM Platform</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['ServiceNow', 'Jira Service Management', 'BMC Remedy', 'eTOM REST Webhook'] as ITSMPlatform[]).map(plat => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setTargetPlatform(plat)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center ${
                      targetPlatform === plat
                        ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-sm'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {plat === 'Jira Service Management' ? 'Jira SM' : plat === 'eTOM REST Webhook' ? 'eTOM API' : plat}
                  </button>
                ))}
              </div>
            </div>

            {/* Incident Context Details */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1 font-mono-num">
              <div className="flex justify-between">
                <span className="text-slate-400">Title:</span>
                <span className="text-white font-bold">{dispatchTargetIncident.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Impacted Subscribers:</span>
                <span className="text-rose-400 font-bold">{dispatchTargetIncident.impactedSubscribers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Revenue at Risk:</span>
                <span className="text-amber-400 font-bold">{(dispatchTargetIncident.revenueAtRiskDZD / 1000).toFixed(0)}k DZD/mo</span>
              </div>
            </div>

            {/* Custom Operator Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Additional NOC Notes / Action Order (Optional)
              </label>
              <textarea
                value={customOperatorNotes}
                onChange={(e) => setCustomOperatorNotes(e.target.value)}
                placeholder="e.g., Escalated directly to Core Team. Request microwave link TLM-MANS-HOP2 inspection."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {dispatchSuccessMsg && (
              <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{dispatchSuccessMsg}</span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsDispatchModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDispatch}
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to {targetPlatform}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
