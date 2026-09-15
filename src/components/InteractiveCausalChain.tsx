import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  Radio, 
  Activity, 
  Layers, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  Zap,
  ArrowRight
} from 'lucide-react';

interface InteractiveCausalChainProps {
  onOpenIncidentDetail?: () => void;
  onOpenScenarioCenter?: () => void;
  onNavigateToOperations?: () => void;
}

export const InteractiveCausalChain: React.FC<InteractiveCausalChainProps> = ({
  onOpenIncidentDetail,
  onOpenScenarioCenter,
  onNavigateToOperations
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const steps = [
    {
      num: 1,
      name: 'Normal Baseline',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      badge: 'NOMINAL',
      kpi: 'Latency 21ms • Loss 0.16%',
      summary: 'All 38 cellular radio sectors operating within nominal 24h baseline. 0 anomalies detected.',
      color: 'border-emerald-500/40 text-emerald-400'
    },
    {
      num: 2,
      name: 'Degradation',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      badge: 'EVENT INJECTED',
      kpi: 'RTT Spike +38% • Loss +12%',
      summary: 'Physical microwave backhaul transport hop experiences carrier signal attenuation.',
      color: 'border-amber-500/40 text-amber-400'
    },
    {
      num: 3,
      name: 'RAN Anomaly',
      icon: <Activity className="w-4 h-4 text-rose-400" />,
      badge: 'ISOLATION FOREST',
      kpi: 'Score: -0.18 • Contam 0.05',
      summary: 'Unsupervised Isolation Forest algorithm isolates anomalous multi-dimensional telemetry vector.',
      color: 'border-rose-500/40 text-rose-400'
    },
    {
      num: 4,
      name: 'Topology Correlated',
      icon: <Server className="w-4 h-4 text-sky-400" />,
      badge: 'TOPOLOGY MAP',
      kpi: '7 Sectors • 3 Sites',
      summary: 'Topological deduplication engine clusters 7 degraded sectors sharing common backhaul hub SITE-SAI-001.',
      color: 'border-sky-500/40 text-sky-400'
    },
    {
      num: 5,
      name: 'Customer Impact',
      icon: <Users className="w-4 h-4 text-indigo-400" />,
      badge: 'CROSS-DOMAIN',
      kpi: '1,284 Users • 12.5k DZD',
      summary: 'Cross-domain correlation identifies 1,284 connected subscribers (237 high churn risk) and 12,500 DZD revenue risk.',
      color: 'border-indigo-500/40 text-indigo-400'
    },
    {
      num: 6,
      name: 'P1 Incident Created',
      icon: <ShieldAlert className="w-4 h-4 text-purple-400" />,
      badge: 'DYNAMIC SLA',
      kpi: 'Priority: P1 • Score: 87',
      summary: 'Canonical incident INC-0001 created with automated 60-minute SLA countdown and executive escalation.',
      color: 'border-purple-500/40 text-purple-400'
    },
    {
      num: 7,
      name: 'AI Assessment',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      badge: '6-QUESTION BRIEF',
      kpi: 'Confidence: 84%',
      summary: 'Root cause diagnosed as microwave hop RSSI degradation; recommends automated carrier failover to 2600MHz.',
      color: 'border-cyan-500/40 text-cyan-400'
    },
    {
      num: 8,
      name: 'ITSM Dispatched',
      icon: <Send className="w-4 h-4 text-emerald-400" />,
      badge: 'WORK ORDER',
      kpi: 'INC-SNOW-89421',
      summary: 'Structured eTOM work order dispatched to ServiceNow / Jira Service Management with AI evidence payload.',
      color: 'border-emerald-500/40 text-emerald-400'
    },
  ];

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= steps.length) {
          setIsPlaying(false);
          return 1;
        }
        return prev + 1;
      });
    }, 2800);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const current = steps[activeStep - 1];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 shadow-xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Closed-Loop Operational Intelligence Flow
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                END-TO-END DEMONSTRATOR
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive visualization of TelecomAI 2.0 closed-loop autonomy
            </p>
          </div>
        </div>

        {/* Play / Step controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            id="causal-chain-play-btn"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Tour</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Live Flow</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveStep(1);
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Flow Stages */}
      <div className="py-3.5 overflow-x-auto">
        <div className="flex items-center min-w-[760px] justify-between gap-1 relative">
          {steps.map((st, idx) => {
            const isActive = activeStep === st.num;
            const isCompleted = activeStep > st.num;
            return (
              <React.Fragment key={st.num}>
                <div
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStep(st.num);
                  }}
                  className={`flex flex-col items-center p-2 rounded-xl border transition cursor-pointer select-none flex-1 ${
                    isActive
                      ? `${st.color} bg-slate-950 ring-2 ring-sky-400 shadow-lg scale-105 z-10`
                      : isCompleted
                        ? 'border-slate-700 bg-slate-950/60 opacity-90'
                        : 'border-slate-800/80 bg-slate-950/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-bold font-mono text-slate-400">
                      0{st.num}
                    </span>
                    {st.icon}
                  </div>
                  <span className="text-xs font-bold text-white text-center leading-tight">
                    {st.name}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 mt-1 truncate max-w-full">
                    {st.kpi}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition ${
                    activeStep > idx + 1 ? 'text-sky-400' : 'text-slate-700'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Step Explainer Card */}
      <div className="mt-2 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
            {current.icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Stage 0{current.num}: {current.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {current.badge}
              </span>
              <span className="text-xs font-mono font-bold text-sky-400">
                {current.kpi}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {current.summary}
            </p>
          </div>
        </div>

        {/* Action Link for this step */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {activeStep >= 6 && onOpenIncidentDetail && (
            <button
              onClick={onOpenIncidentDetail}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              Open Incident INC-0001
            </button>
          )}

          {onOpenScenarioCenter && (
            <button
              onClick={onOpenScenarioCenter}
              className="px-3 py-1.5 bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              Configure Scenario
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
