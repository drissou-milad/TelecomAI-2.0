import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  RotateCcw, 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Layers,
  Users,
  DollarSign,
  Info,
  X,
  Send,
  Sliders
} from 'lucide-react';

interface SimulationStatus {
  isActive: boolean;
  scenarioName: string;
  targetWilaya: string;
  degradedCellCount: number;
  simulatedIncidentId: string;
  startedAt: string | null;
  currentAnomalyCount: number;
}

interface CorrelationResult {
  incident_id: string;
  severity: string;
  priority: string;
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

interface SimulationControllerProps {
  onRefreshAll?: () => void;
  onNavigateToOperations?: () => void;
  onOpenScenarioCenter?: () => void;
}

export const SimulationController: React.FC<SimulationControllerProps> = ({
  onRefreshAll,
  onNavigateToOperations,
  onOpenScenarioCenter
}) => {
  const [status, setStatus] = useState<SimulationStatus>({
    isActive: true,
    scenarioName: 'Saïda High-Plateaux Microwave Congestion',
    targetWilaya: 'Saida',
    degradedCellCount: 7,
    simulatedIncidentId: 'INC-0001',
    startedAt: new Date().toISOString(),
    currentAnomalyCount: 7
  });

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [correlationData, setCorrelationData] = useState<CorrelationResult | null>(null);
  const [itsmDispatchedTicket, setItsmDispatchedTicket] = useState<{ id: string; system: string; url: string } | null>(null);
  const [dispatchingITSM, setDispatchingITSM] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Poll or fetch simulation status on mount
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/simulation/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (e) {
      console.warn('Simulation status poll error:', e);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSimulateDegrade = async (wilaya: string = 'Saida') => {
    setLoadingAction('degrade');
    try {
      const res = await fetch('/api/simulation/degrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wilaya })
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(data.simulation);
        setNotification(`Degradation simulation initiated on ${wilaya} (7 cells degraded, INC-0001 reopened)`);
        setTimeout(() => setNotification(null), 4000);
        if (onRefreshAll) onRefreshAll();
      }
    } catch (e: any) {
      setNotification(`Failed to simulate degradation: ${e.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleResetSimulation = async () => {
    setLoadingAction('reset');
    try {
      const res = await fetch('/api/simulation/reset', {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(data.simulation);
        setNotification('Simulation reset: All cells restored to nominal baseline. INC-0001 marked RESOLVED.');
        setTimeout(() => setNotification(null), 4000);
        if (onRefreshAll) onRefreshAll();
      }
    } catch (e: any) {
      setNotification(`Failed to reset simulation: ${e.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRunCorrelationLoop = async () => {
    setLoadingAction('analyze');
    try {
      const res = await fetch('/api/network/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wilaya: 'Saida' })
      });
      if (res.ok) {
        const result: CorrelationResult = await res.json();
        setCorrelationData(result);
        setModalOpen(true);
        // Reset dispatched state for new loop run
        setItsmDispatchedTicket({
          id: 'INC-SNOW-89421',
          system: 'ServiceNow',
          url: 'https://prototype-itsm.telecomai.internal/tickets/INC-SNOW-89421'
        });
      }
    } catch (e: any) {
      setNotification(`Analysis error: ${e.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDispatchITSMTicket = async () => {
    if (!correlationData) return;
    setDispatchingITSM(true);
    try {
      const res = await fetch('/api/integrations/itsm/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident_id: correlationData.incident_id,
          title: `Regional Transport Degradation - ${correlationData.infrastructure.wilaya} Footprint`,
          priority: correlationData.priority,
          severity: correlationData.severity,
          affected_infrastructure: {
            wilaya: correlationData.infrastructure.wilaya,
            sites: correlationData.infrastructure.sites,
            cells: correlationData.infrastructure.cells,
            cell_ids: correlationData.traceability?.analyzed_cells || [],
            site_ids: correlationData.traceability?.analyzed_sites || []
          },
          customer_impact: correlationData.customer_impact,
          business_impact: {
            impact_score: correlationData.business_impact.impact_score,
            revenue_at_risk_dzd: correlationData.business_impact.revenue_at_risk
          },
          ai_assessment: correlationData.ai_analysis.assessment,
          recommended_action: correlationData.ai_analysis.recommended_action,
          confidence: correlationData.ai_analysis.confidence,
          system: 'ServiceNow'
        })
      });

      if (res.ok) {
        const ticket = await res.json();
        setItsmDispatchedTicket({
          id: ticket.ticket_id,
          system: ticket.system,
          url: ticket.external_url
        });
        setNotification(`Dispatched ticket ${ticket.ticket_id} to ${ticket.system} with automated SLA countdown.`);
        setTimeout(() => setNotification(null), 4000);
        if (onRefreshAll) onRefreshAll();
      }
    } catch (e: any) {
      setNotification(`ITSM Dispatch failed: ${e.message}`);
    } finally {
      setDispatchingITSM(false);
    }
  };

  return (
    <div className="mb-4">
      {/* Simulation Banner & Quick Actions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Status & Scope */}
          <div className="flex items-start sm:items-center gap-3">
            <div className={`p-2 rounded-lg border ${
              status.isActive 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <Activity className="w-4 h-4" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Simulation Engine:
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono-num ${
                  status.isActive 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {status.isActive ? 'ACTIVE INCIDENT SIMULATION' : 'NOMINAL BASELINE'}
                </span>
                <span className="text-xs text-slate-400">
                  {status.scenarioName}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {status.isActive 
                  ? `7 degraded sectors in Saïda footprint • 1,284 affected subscribers • 12,500 DZD synthetic estimated revenue exposure • P1 Priority`
                  : 'All cells operating within nominal baseline parameters (0 anomalies detected)'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 lg:pt-0">
            {status.isActive ? (
              <button
                onClick={handleResetSimulation}
                disabled={loadingAction === 'reset'}
                id="btn-sim-reset"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${loadingAction === 'reset' ? 'animate-spin' : ''}`} />
                <span>Restore Normal Baseline</span>
              </button>
            ) : (
              <button
                onClick={() => handleSimulateDegrade('Saida')}
                disabled={loadingAction === 'degrade'}
                id="btn-sim-degrade"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold rounded-lg border border-rose-500/40 transition cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate Saïda Incident</span>
              </button>
            )}

            <button
              onClick={handleRunCorrelationLoop}
              disabled={loadingAction === 'analyze'}
              id="btn-sim-run-loop"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm shadow-sky-500/20 transition cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${loadingAction === 'analyze' ? 'animate-spin' : ''}`} />
              <span>Inspect AI Operational Loop</span>
            </button>

            {onOpenScenarioCenter && (
              <button
                onClick={onOpenScenarioCenter}
                id="btn-sim-open-scenario-center"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/50 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Scenario Center</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Disclaimer Banner */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-400 gap-1.5 font-mono-num">
          <div className="flex items-center gap-1.5 text-amber-300/90">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Synthetic telecom environment — illustrative data, not real operator statistics.</span>
          </div>
          <span className="text-slate-400">
            Data Traceability: Telemetry → Anomaly → Correlation → Impact → Incident → Action → ITSM
          </span>
        </div>

        {notification && (
          <div className="mt-2 text-xs bg-sky-950/80 border border-sky-600/40 text-sky-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Operational Intelligence Modal: Full Causal Loop */}
      {modalOpen && correlationData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>TelecomAI 2.0 Operational Intelligence Pipeline</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      LIVE INFERENCE
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      SYNTHETIC DEMO
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Causal chain from physical network degradation to subscriber risk and ITSM dispatch
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: The 8-Step Causal Trace */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Step 1 & 2: Telemetry & Detection */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    <span>1. Telemetry Ingestion & Anomaly Detection</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    SEVERITY: {correlationData.severity}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono-num text-[11px]">
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Footprint</span>
                    <span className="text-white font-bold">{correlationData.infrastructure.wilaya}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Degraded Sectors</span>
                    <span className="text-rose-400 font-bold">{correlationData.infrastructure.cells} cells ({correlationData.infrastructure.sites} sites)</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Latency Spike</span>
                    <span className="text-rose-400 font-bold">+{correlationData.network_impact.latency_increase_pct}% vs baseline</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Packet Loss Delta</span>
                    <span className="text-rose-400 font-bold">+{correlationData.network_impact.packet_loss_increase_pct}% vs baseline</span>
                  </div>
                </div>
              </div>

              {/* Step 3 & 4: Customer & Business Impact */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>2. Customer Correlation & Business Impact</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    IMPACT SCORE: {correlationData.business_impact.impact_score}/100
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono-num text-[11px]">
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Total Blast Radius</span>
                    <span className="text-amber-400 font-bold text-sm">
                      {correlationData.customer_impact.affected_customers.toLocaleString()} subscribers
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">High-Risk Churn Strata</span>
                    <span className="text-rose-400 font-bold text-sm">
                      {correlationData.customer_impact.high_risk_customers} accounts
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Monthly Revenue at Risk</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {correlationData.business_impact.revenue_at_risk.toLocaleString()} DZD/mo
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 5 & 6: Incident Priority & AI Analysis */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>3. Incident Creation & Operational Prioritization</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">Dynamic Priority:</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-black bg-rose-500 text-white">
                      {correlationData.priority} (SLA: 60 min)
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <span className="text-sky-300 font-bold block mb-1">AI Operational Assessment:</span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {correlationData.ai_analysis.assessment}
                    </p>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <span className="text-emerald-300 font-bold block mb-1">Recommended Engineering Playbook:</span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {correlationData.ai_analysis.recommended_action}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Model Confidence: {(correlationData.ai_analysis.confidence * 100).toFixed(0)}%</span>
                      <span>Deduplication ID: {correlationData.incident_id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 7: ITSM Integration */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Send className="w-4 h-4" />
                    <span>4. ITSM Integration Prototype (Work-Order Dispatch)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Target: ServiceNow-Compatible Payload
                  </span>
                </div>

                {itsmDispatchedTicket ? (
                  <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{itsmDispatchedTicket.id}</span>
                          <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] rounded font-mono">
                            PROTOTYPE ASSIGNED
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Work-order payload dispatched to {itsmDispatchedTicket.system} prototype registry • In-memory sandbox simulation
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleDispatchITSMTicket}
                      disabled={dispatchingITSM}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold border border-slate-700 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${dispatchingITSM ? 'animate-spin' : ''}`} />
                      <span>Re-Dispatch Ticket</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-xs">Ready to dispatch ServiceNow-compatible work order to prototype sandbox.</span>
                    <button
                      onClick={handleDispatchITSMTicket}
                      disabled={dispatchingITSM}
                      className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Send className={`w-3.5 h-3.5 ${dispatchingITSM ? 'animate-spin' : ''}`} />
                      <span>Create Prototype Ticket</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                Endpoint: POST /api/network/analyze • Fully reproducible deterministic correlation
              </span>
              <button
                onClick={() => {
                  setModalOpen(false);
                  if (onNavigateToOperations) onNavigateToOperations();
                }}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <span>View in Operations Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
