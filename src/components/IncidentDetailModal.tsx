import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  Activity, 
  Users, 
  DollarSign, 
  Radio, 
  CheckCircle2, 
  ExternalLink, 
  Send, 
  Sliders, 
  HelpCircle,
  FileText,
  AlertTriangle,
  ChevronRight,
  Zap,
  Layers,
  Wrench,
  MessageSquare
} from 'lucide-react';
import { TelecomIncident } from '../types';

interface IncidentDetailModalProps {
  incident: TelecomIncident | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (incidentId: string, newStatus: string) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  isOpen,
  onClose,
  onUpdateStatus
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'ai_assessment' | 'explainability' | 'itsm'>('overview');
  const [dispatching, setDispatching] = useState<boolean>(false);
  const [ticketResult, setTicketResult] = useState<any | null>(null);
  const [targetSystem, setTargetSystem] = useState<'ServiceNow' | 'Jira Service Management'>('ServiceNow');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!isOpen || !incident) return null;

  const isP1 = incident.priority.startsWith('P1');

  const handleDispatchITSM = async () => {
    setDispatching(true);
    try {
      const res = await fetch('/api/integrations/itsm/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident_id: incident.id,
          title: incident.title,
          priority: isP1 ? 'P1' : 'P2',
          severity: isP1 ? 'CRITICAL' : 'HIGH',
          system: targetSystem,
          affected_infrastructure: {
            wilaya: incident.wilaya,
            sites: 3,
            cells: 7,
            cell_ids: [incident.cellId],
            site_ids: [incident.siteId]
          },
          customer_impact: {
            affected_customers: incident.impactedSubscribers,
            high_risk_customers: Math.round(incident.impactedSubscribers * 0.18)
          },
          business_impact: {
            impact_score: incident.priorityScore || 87,
            revenue_at_risk_dzd: incident.revenueAtRiskDZD
          },
          ai_assessment: incident.rootCauseDiagnosis,
          recommended_action: incident.recommendedAction,
          confidence: 0.84
        })
      });

      if (res.ok) {
        const ticket = await res.json();
        setTicketResult(ticket);
        setActionSuccess(`Successfully dispatched ticket ${ticket.ticket_id} to ${ticket.system}`);
        if (onUpdateStatus) {
          onUpdateStatus(incident.id, 'DISPATCHED_TO_ITSM');
        }
      }
    } catch (e: any) {
      setActionSuccess(`Dispatch failed: ${e.message}`);
    } finally {
      setDispatching(false);
    }
  };

  const handleExecutePlaybook = (actionName: string) => {
    setActionSuccess(`Engineering command initiated: ${actionName}. Telemetry bus monitoring for recovery.`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isP1 
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' 
                : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                  {incident.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono-num ${
                  isP1
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {incident.priority}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  STATUS: {incident.status}
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-1">
                {incident.title}
              </h2>
              <p className="text-xs text-slate-400">
                Wilaya: <span className="text-slate-200 font-semibold">{incident.wilaya}</span> • Detected at: <span className="text-slate-200 font-mono">{incident.detectedAt}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onUpdateStatus && incident.status !== 'RESOLVED' && (
              <button
                onClick={() => onUpdateStatus(incident.id, 'RESOLVED')}
                className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Mark Resolved
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-950/40 border-b border-slate-800 flex overflow-x-auto gap-1">
          {[
            { id: 'overview', label: 'Executive Impact', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'evidence', label: 'Network Telemetry Evidence', icon: <Activity className="w-3.5 h-3.5" /> },
            { id: 'ai_assessment', label: 'AI Operational Brief (6-Q)', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'explainability', label: 'Priority Scoring & Evidence Proof', icon: <HelpCircle className="w-3.5 h-3.5" /> },
            { id: 'itsm', label: 'ITSM Work Order Bridge', icon: <Send className="w-3.5 h-3.5" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {actionSuccess && (
            <div className="text-xs bg-sky-950/80 border border-sky-500/40 text-sky-200 p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* TAB 1: EXECUTIVE & IMPACT OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-xs mb-1 flex items-center justify-between">
                    <span>Subscribers Exposed</span>
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="text-xl font-bold text-white font-mono-num">
                    {incident.impactedSubscribers.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-amber-400 mt-1">
                    ~{Math.round(incident.impactedSubscribers * 0.18)} high churn risk
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-xs mb-1 flex items-center justify-between">
                    <span>Revenue at Risk</span>
                    <DollarSign className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div className="text-xl font-bold text-rose-400 font-mono-num">
                    {incident.revenueAtRiskDZD.toLocaleString()} DZD
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Monthly recurring exposure
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-xs mb-1 flex items-center justify-between">
                    <span>Affected Footprint</span>
                    <Radio className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div className="text-xl font-bold text-white font-mono-num">
                    7 Cells / 3 Sites
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">
                    Hub: {incident.siteName}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 text-xs mb-1 flex items-center justify-between">
                    <span>Priority Score</span>
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="text-xl font-bold text-purple-400 font-mono-num">
                    {incident.priorityScore || 87} / 100
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    SLA: {isP1 ? '60 mins' : '240 mins'}
                  </div>
                </div>
              </div>

              {/* Playbook Quick Execution */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-sky-400" />
                  <span>Recommended Operational Mitigation Playbooks</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-white">
                        Carrier Frequency Failover (SITE-SAI-001)
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Re-routes 1800MHz traffic over redundant 2600MHz carrier and drops non-critical paging overhead.
                      </p>
                    </div>
                    <button
                      onClick={() => handleExecutePlaybook('Carrier Frequency Failover on SITE-SAI-001')}
                      className="mt-3 flex items-center justify-center gap-1 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-md transition cursor-pointer"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Execute Carrier Failover</span>
                    </button>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-white">
                        Proactive Care SMS & 5GB Goodwill Bonus
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Pushes proactive notification to the 237 high-risk subscribers to prevent customer churn calls.
                      </p>
                    </div>
                    <button
                      onClick={() => handleExecutePlaybook('Proactive 5GB Retention SMS to 237 Exposed High-Risk Subscribers')}
                      className="mt-3 flex items-center justify-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-md transition cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Send Proactive SMS Bonus</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NETWORK TELEMETRY EVIDENCE */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  Telemetry Comparison (Baseline vs. Current Degradation)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-400">RTT Latency Surge</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-rose-400 font-mono-num">29.2 ms</span>
                      <span className="text-xs text-slate-500 line-through font-mono-num">21.1 ms baseline</span>
                      <span className="text-xs font-bold text-rose-400 font-mono-num">+38.4%</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Crosses SLA threshold for low-latency voice and transport streaming.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-400">Packet Loss Surge</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-rose-400 font-mono-num">3.56%</span>
                      <span className="text-xs text-slate-500 line-through font-mono-num">0.16% baseline</span>
                      <span className="text-xs font-bold text-rose-400 font-mono-num">+12.0% delta</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Excessive TCP retransmissions triggering subscriber perceived buffering.
                    </p>
                  </div>
                </div>
              </div>

              {/* Physical Sectors Table */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  Involved Physical Radio Cells
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300 font-mono-num">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-2">Cell ID</th>
                        <th className="p-2">Band</th>
                        <th className="p-2">Health</th>
                        <th className="p-2">Latency</th>
                        <th className="p-2">Packet Loss</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {[
                        { id: 'CELL-SAI-001A', band: '1800 MHz', health: 25, lat: '29.2ms', loss: '3.6%', status: 'ANOMALY' },
                        { id: 'CELL-SAI-001B', band: '1800 MHz', health: 25, lat: '29.2ms', loss: '3.6%', status: 'ANOMALY' },
                        { id: 'CELL-SAI-002A', band: '2600 MHz', health: 25, lat: '29.2ms', loss: '3.6%', status: 'ANOMALY' },
                        { id: 'CELL-SAI-002B', band: '2600 MHz', health: 25, lat: '29.2ms', loss: '3.6%', status: 'ANOMALY' },
                        { id: 'CELL-SAI-003A', band: '800 MHz', health: 25, lat: '29.2ms', loss: '3.6%', status: 'ANOMALY' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-800/30">
                          <td className="p-2 font-bold text-sky-400">{row.id}</td>
                          <td className="p-2">{row.band}</td>
                          <td className="p-2 text-rose-400 font-bold">{row.health}/100</td>
                          <td className="p-2 text-rose-300">{row.lat}</td>
                          <td className="p-2 text-rose-300">{row.loss}</td>
                          <td className="p-2">
                            <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI OPERATIONAL ASSESSMENT (6-QUESTIONS) */}
          {activeTab === 'ai_assessment' && (
            <div className="space-y-4">
              <div className="bg-sky-950/30 border border-sky-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>6-Question Structured Root Cause Assessment</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    AI Confidence: 84%
                  </span>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                    <span className="font-bold text-slate-300 block mb-1">
                      1. What happened?
                    </span>
                    <p className="text-slate-400 leading-relaxed">
                      Simultaneous latency surge (+38.4%) and packet loss anomaly (+12%) detected across 7 LTE radio sectors connected to the Saïda central hub.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                    <span className="font-bold text-slate-300 block mb-1">
                      2. Why is it important?
                    </span>
                    <p className="text-slate-400 leading-relaxed">
                      1,284 subscribers are actively connected, with 237 exhibiting elevated baseline churn probabilities. Total exposed recurring revenue is 12,500 DZD/month.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                    <span className="font-bold text-slate-300 block mb-1">
                      3. Who is affected?
                    </span>
                    <p className="text-slate-400 leading-relaxed">
                      Subscribers in Saïda Centre-Ville, Zone Industrielle, and El Hassasna footprint. 12 corporate VIP accounts are attached to affected sector CELL-SAI-001A.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                    <span className="font-bold text-slate-300 block mb-1">
                      4. What evidence supports this?
                    </span>
                    <p className="text-slate-400 leading-relaxed">
                      Unsupervised Isolation Forest flagged anomalous RTT/PRB vector on 1800MHz carrier. RTT increased from 21.1ms to 29.2ms; PRB utilization reached 88.5%.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                    <span className="font-bold text-slate-300 block mb-1">
                      5. What should operations investigate next?
                    </span>
                    <p className="text-slate-400 leading-relaxed">
                      Inspect microwave point-to-point hop link RSSI on SITE-SAI-001 backhaul dish; verify intermediate switch port buffer queue depth.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                    <span className="font-bold text-slate-300 block mb-1">
                      6. Recommended Engineering Playbook:
                    </span>
                    <p className="text-sky-300 font-semibold leading-relaxed">
                      Execute carrier frequency failover to 2600MHz on SITE-SAI-001, and dispatch Tier 2 Microwave Transmission field technician for antenna alignment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXPLAINABILITY & EVIDENCE PROOF (PRIORITY 4) */}
          {activeTab === 'explainability' && (
            <div className="space-y-4">
              {/* Formula weights */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Priority Formulation Weights (Why P1?)
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  TelecomAI 2.0 calculates priority dynamically using an auditable, multi-factor impact formula:
                </p>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Network Severity (+38% Latency, +12% Loss)</span>
                      <span className="font-bold font-mono">40% Weight • Score: 36.0</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Customer Blast Radius (1,284 Users, 237 Churn Risk)</span>
                      <span className="font-bold font-mono">25% Weight • Score: 22.5</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Revenue Exposure (12,500 DZD Monthly ARPU)</span>
                      <span className="font-bold font-mono">20% Weight • Score: 17.0</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Infrastructure Criticality (Central Regional Hub)</span>
                      <span className="font-bold font-mono">10% Weight • Score: 8.5</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>VIP Corporate Accounts (12 Enterprise Accounts)</span>
                      <span className="font-bold font-mono">5% Weight • Score: 4.5</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold">
                  <span className="text-white">Aggregate Prioritization Score:</span>
                  <span className="text-rose-400 font-mono text-base">88.5 / 100 ➔ P1-CRITICAL</span>
                </div>
              </div>

              {/* Auditable Evidence Checklist */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  Verified Operational Evidence Checklist
                </h4>
                <div className="space-y-2 text-xs">
                  {[
                    'RTT Latency increased +38.4% above rolling 24-hour baseline',
                    'Packet loss delta reached +12% across 7 adjacent sectors',
                    'Cell health score degraded from nominal 97/100 down to 25/100',
                    '1,284 subscribers attached within affected sector coverage polygons',
                    '237 subscribers identified with pre-existing elevated churn risk (>0.50)',
                    '3 physical sites share common upstream microwave transport link',
                    'Service-level agreement countdown initialized (60-minute window)'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ITSM DISPATCH BRIDGE */}
          {activeTab === 'itsm' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Enterprise ITSM Work Order Dispatcher
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Dispatches normalized eTOM/ITIL operational ticket with structured AI root-cause diagnostics and subscriber blast radius.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Target Ticketing Platform
                    </label>
                    <select
                      value={targetSystem}
                      onChange={(e: any) => setTargetSystem(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono-num cursor-pointer"
                    >
                      <option value="ServiceNow">ServiceNow (Table API / Incident Management)</option>
                      <option value="Jira Service Management">Jira Service Management (REST v3)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Assignment Group
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="RAN_ENGINEERING_TIER_2"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400 font-mono"
                    />
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 mb-4 overflow-x-auto">
                  <div className="text-slate-500 font-bold mb-1">// Outbound JSON Dispatch Payload:</div>
                  <pre className="text-sky-300">
{JSON.stringify({
  incident_id: incident.id,
  priority: isP1 ? 'P1' : 'P2',
  severity: isP1 ? 'CRITICAL' : 'HIGH',
  system: targetSystem,
  blast_radius: {
    affected_subscribers: incident.impactedSubscribers,
    monthly_revenue_risk_dzd: incident.revenueAtRiskDZD
  },
  ai_playbook: incident.recommendedAction
}, null, 2)}
                  </pre>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Status: {incident.itsmTicket ? `Synced with ${incident.itsmTicket.platform}` : 'Awaiting manual or automated dispatch'}
                  </span>

                  <button
                    onClick={handleDispatchITSM}
                    disabled={dispatching}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg transition shadow-md shadow-sky-500/20 cursor-pointer disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${dispatching ? 'animate-spin' : ''}`} />
                    <span>{dispatching ? 'Dispatching to ITSM...' : `Dispatch to ${targetSystem}`}</span>
                  </button>
                </div>

                {ticketResult && (
                  <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-xs text-emerald-300">
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Work Order Created: {ticketResult.ticket_id}</span>
                    </div>
                    <p className="text-[11px] text-emerald-400/80">
                      Dispatched to {ticketResult.system} • Priority: {ticketResult.priority} • Status: {ticketResult.status}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono-num">
          <span>TelecomAI 2.0 Operational Incident Engine</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
