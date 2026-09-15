import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  Radio, 
  Activity, 
  Layers, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Server, 
  TrendingDown,
  DollarSign,
  Clock,
  Wrench,
  Sliders
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
      name: 'NETWORK DEGRADATION',
      shortName: 'Degradation',
      icon: <Activity className="w-3.5 h-3.5 text-rose-400" />,
      badge: 'RAN TELEMETRY',
      kpi: 'Latency +38% • Loss +12%',
      summary: 'Microwave backhaul transport hop experiences carrier signal attenuation and frame discard.',
      color: 'border-rose-500/40 text-rose-400'
    },
    {
      num: 2,
      name: 'ANOMALY DETECTED',
      shortName: 'Anomaly',
      icon: <Radio className="w-3.5 h-3.5 text-amber-400" />,
      badge: 'ISOLATION FOREST',
      kpi: 'Score: -0.18 • Contam 0.05',
      summary: 'Unsupervised Isolation Forest flags multi-dimensional telemetry vector anomaly exceeding 5-sigma.',
      color: 'border-amber-500/40 text-amber-400'
    },
    {
      num: 3,
      name: 'CELL/SITE IDENTIFIED',
      shortName: 'Topology',
      icon: <Server className="w-3.5 h-3.5 text-sky-400" />,
      badge: 'TOPOLOGY MAP',
      kpi: '4 Cells • 2 Sites (Saïda Hub)',
      summary: 'Topological deduplication isolates 7 degraded sectors sharing backhaul hub SITE-SAI-001.',
      color: 'border-sky-500/40 text-sky-400'
    },
    {
      num: 4,
      name: 'CUSTOMERS AFFECTED',
      shortName: 'Blast Radius',
      icon: <Users className="w-3.5 h-3.5 text-indigo-400" />,
      badge: 'SPATIAL JOIN',
      kpi: '1,284 Attached • 187 Risk',
      summary: 'Cross-domain correlation links 1,284 active subscribers with coverage footprint of degraded sectors.',
      color: 'border-indigo-500/40 text-indigo-400'
    },
    {
      num: 5,
      name: 'CXS DECREASE',
      shortName: 'CXS Drop',
      icon: <TrendingDown className="w-3.5 h-3.5 text-rose-400" />,
      badge: 'EXPERIENCE SCORE',
      kpi: 'CXS: 82.4 ➔ 48.1 (-34.3)',
      summary: 'Subscriber Customer Experience Score drops due to buffered streaming and dropped call rates.',
      color: 'border-rose-500/40 text-rose-400'
    },
    {
      num: 6,
      name: 'REVENUE AT RISK',
      shortName: 'ARPU Risk',
      icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
      badge: 'BUSINESS IMPACT',
      kpi: '12,500 DZD Exposure',
      summary: 'Financial correlation quantifies monthly recurring revenue risk including 12 enterprise accounts.',
      color: 'border-emerald-500/40 text-emerald-400'
    },
    {
      num: 7,
      name: 'INCIDENT CREATED',
      shortName: 'Incident',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />,
      badge: 'ALARM DEDUP',
      kpi: 'INC-0001 Created',
      summary: 'Alarm suppression engine registers canonical operational incident INC-0001 rather than raw alert floods.',
      color: 'border-purple-500/40 text-purple-400'
    },
    {
      num: 8,
      name: 'P1/P2 PRIORITY',
      shortName: 'Priority P1',
      icon: <Clock className="w-3.5 h-3.5 text-rose-400" />,
      badge: 'DYNAMIC SLA',
      kpi: 'P1 — CRITICAL (60m SLA)',
      summary: 'Multi-factor formulation scores urgency at 88.5/100, triggering P1 SLA and executive notification.',
      color: 'border-rose-500/40 text-rose-400'
    },
    {
      num: 9,
      name: 'AI ASSESSMENT',
      shortName: 'AI Brief',
      icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
      badge: '6-QUESTION BRIEF',
      kpi: 'Confidence: 84%',
      summary: '6-Question operational briefing synthesized with root cause diagnosis and evidence breakdown.',
      color: 'border-cyan-500/40 text-cyan-400'
    },
    {
      num: 10,
      name: 'RECOMMENDED ACTION',
      shortName: 'Playbook',
      icon: <Wrench className="w-3.5 h-3.5 text-sky-400" />,
      badge: 'DUAL PLAYBOOK',
      kpi: 'Failover + Field Tech',
      summary: 'Automated recommendation for 2600MHz carrier failover alongside field technician transmission dispatch.',
      color: 'border-sky-500/40 text-sky-400'
    },
    {
      num: 11,
      name: 'ITSM WORK ORDER',
      shortName: 'ITSM Order',
      icon: <Send className="w-3.5 h-3.5 text-emerald-400" />,
      badge: 'ENTERPRISE ITSM',
      kpi: 'ServiceNow INC-89421',
      summary: 'Normalized ticket payload synchronized with enterprise ServiceNow / Jira Service Management.',
      color: 'border-emerald-500/40 text-emerald-400'
    },
  ];

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= steps.length) {
          setTimeout(() => setIsPlaying(false), 0);
          return 1;
        }
        return prev + 1;
      });
    }, 2400);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const current = steps[activeStep - 1] || steps[0];

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
                11-Step Operational Intelligence Flow
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                CLOSED-LOOP
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive trace showing how physical RAN degradation cascades into AI prioritization and enterprise ITSM dispatch.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-sky-400" />
                <span>Auto-Trace Flow</span>
              </>
            )}
          </button>

          {onOpenScenarioCenter && (
            <button
              type="button"
              onClick={onOpenScenarioCenter}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-lg text-xs font-semibold border border-sky-500/40 transition cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Scenario Center</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Steps Bar (Scrollable on small screens) */}
      <div className="py-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-[980px]">
          {steps.map((step) => {
            const isCurrent = activeStep === step.num;
            const isCompleted = activeStep > step.num;

            return (
              <React.Fragment key={step.num}>
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStep(step.num);
                  }}
                  className={`flex-1 p-2 rounded-lg border text-left transition cursor-pointer relative ${
                    isCurrent
                      ? 'border-sky-400 bg-sky-500/15 ring-1 ring-sky-400 shadow-md'
                      : isCompleted
                      ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                      : 'border-slate-900 bg-slate-950/30 text-slate-500 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`w-4 h-4 rounded text-[10px] font-bold font-mono flex items-center justify-center ${
                      isCurrent
                        ? 'bg-sky-500 text-slate-950'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {step.num}
                    </span>
                    <span className="text-[9px] font-mono px-1 rounded bg-slate-800 text-slate-400">
                      {step.badge.split(' ')[0]}
                    </span>
                  </div>

                  <p className={`text-[11px] font-bold truncate ${
                    isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {step.shortName}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 truncate">
                    {step.kpi}
                  </p>
                </button>

                {step.num < steps.length && (
                  <div className="text-slate-700 shrink-0">
                    <ChevronRight className={`w-3.5 h-3.5 ${isCompleted ? 'text-sky-500/60' : 'text-slate-700'}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Step Deep-Dive Bar */}
      <div className="mt-2 p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
            {current.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Step {current.num}: {current.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {current.badge}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {current.summary}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/30">
            {current.kpi}
          </span>
          {onOpenIncidentDetail && (
            <button
              type="button"
              onClick={onOpenIncidentDetail}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 transition cursor-pointer flex items-center gap-1"
            >
              <span>Incident Detail</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
