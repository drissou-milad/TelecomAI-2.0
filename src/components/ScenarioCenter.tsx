import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, 
  X, 
  Play, 
  Pause,
  RotateCcw, 
  Radio, 
  Layers, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  Server, 
  Users,
  DollarSign,
  Sparkles,
  Send,
  CheckCircle2,
  ArrowDown,
  ArrowRight,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Wrench
} from 'lucide-react';

export type ScenarioType =
  | 'backhaul_degradation'
  | 'cell_congestion'
  | 'high_latency'
  | 'packet_loss'
  | 'cell_availability'
  | 'site_outage'
  | 'regional_degradation'
  | 'nominal';

interface ScenarioCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onScenarioApplied: (resultText: string) => void;
  onOpenIncidentDetail?: () => void;
  onNavigateToOperations?: () => void;
}

interface CausalStep {
  step: number;
  label: string;
  badge: string;
  timeOffset: string;
  summary: string;
  detail: string;
  icon: React.ReactNode;
  metric: string;
  color: string;
}

export const ScenarioCenter: React.FC<ScenarioCenterProps> = ({
  isOpen,
  onClose,
  onScenarioApplied,
  onOpenIncidentDetail,
  onNavigateToOperations
}) => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>('backhaul_degradation');
  const [severityIndex, setSeverityIndex] = useState<number>(3); // 0: LOW, 1: MEDIUM, 2: HIGH, 3: CRITICAL
  const [selectedWilaya, setSelectedWilaya] = useState<string>('Saida');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPlayingChain, setIsPlayingChain] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [chainCompleted, setChainCompleted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const severityLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
  const currentSeverity = severityLevels[severityIndex];

  const scenarios = [
    { id: 'cell_congestion' as ScenarioType, name: 'Network Congestion (PRB Saturation >94%)' },
    { id: 'backhaul_degradation' as ScenarioType, name: 'Backhaul Degradation (Microwave Attenuation +38%)' },
    { id: 'high_latency' as ScenarioType, name: 'High Latency (Buffer Queueing & Jitter Surge)' },
    { id: 'packet_loss' as ScenarioType, name: 'Packet Loss (RF Rain Fade & Retransmission Drop)' },
    { id: 'cell_availability' as ScenarioType, name: 'Cell Availability Degradation (PA Hardware Fault)' },
    { id: 'site_outage' as ScenarioType, name: 'Site Outage (Total Power / Rectifier Failure)' },
    { id: 'regional_degradation' as ScenarioType, name: 'Regional Degradation (Cluster Weather Attenuation)' },
    { id: 'nominal' as ScenarioType, name: 'Nominal Baseline (Restore All 38 Sectors)' },
  ];

  const wilayas = [
    { name: 'Saida', code: '20', region: 'High-Plateaux', sites: '48 Sites / 7 Degraded' },
    { name: 'Algiers', code: '16', region: 'North Metropolitan', sites: '512 Sites' },
    { name: 'Oran', code: '31', region: 'West Coastal', sites: '280 Sites' },
    { name: 'Tlemcen', code: '13', region: 'West Border', sites: '142 Sites' },
    { name: 'Constantine', code: '25', region: 'East Plateau', sites: '198 Sites' },
    { name: 'Sétif', code: '19', region: 'High-Plateaux East', sites: '210 Sites' },
  ];

  const causalChainSteps: CausalStep[] = [
    {
      step: 1,
      label: 'NETWORK DEGRADATION',
      badge: 'RAN TELEMETRY',
      timeOffset: '+0.0s',
      summary: 'Physical microwave transport link experiences carrier signal fade and packet discard.',
      detail: `Latency surges +38.4% above rolling 24h baseline (21.1ms ➔ 29.2ms); packet loss increases to 3.56% on ${selectedWilaya} sectors.`,
      icon: <Activity className="w-3.5 h-3.5 text-rose-400" />,
      metric: 'Latency +38% • Loss +12%',
      color: 'border-rose-500/40 text-rose-400 bg-rose-500/10'
    },
    {
      step: 2,
      label: 'ANOMALY DETECTED',
      badge: 'ISOLATION FOREST',
      timeOffset: '+0.3s',
      summary: 'Unsupervised ML algorithm identifies multi-dimensional telemetry vector anomaly.',
      detail: 'Isolation Forest scores telemetry vector at -0.18 (decision threshold -0.12). 5-sigma anomaly confidence score 92%.',
      icon: <Radio className="w-3.5 h-3.5 text-amber-400" />,
      metric: 'Score: -0.18 • Contam 0.05',
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10'
    },
    {
      step: 3,
      label: 'CELL/SITE IDENTIFIED',
      badge: 'TOPOLOGY DEDUP',
      timeOffset: '+0.6s',
      summary: 'Spatial topology graph correlates degraded sectors to common physical uplink.',
      detail: `Topological deduplication groups 7 degraded radio sectors sharing physical backhaul hub SITE-${selectedWilaya.slice(0, 3).toUpperCase()}-001.`,
      icon: <Server className="w-3.5 h-3.5 text-sky-400" />,
      metric: '4 Cells • 2 Sites (Saïda Hub)',
      color: 'border-sky-500/40 text-sky-400 bg-sky-500/10'
    },
    {
      step: 4,
      label: 'CUSTOMERS AFFECTED',
      badge: 'SPATIAL JOIN',
      timeOffset: '+0.9s',
      summary: 'Cross-domain correlation joins active subscriber registrations with degraded sectors.',
      detail: '1,284 subscribers actively attached in coverage polygon. 187 high-risk subscribers identified with prior repeat complaints.',
      icon: <Users className="w-3.5 h-3.5 text-indigo-400" />,
      metric: '1,284 Affected • 187 High-Risk',
      color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10'
    },
    {
      step: 5,
      label: 'CXS DECREASE',
      badge: 'EXPERIENCE INDEX',
      timeOffset: '+1.2s',
      summary: 'Subscriber Customer Experience Score (CXS) recalculation accounts for transport latency.',
      detail: 'Average customer experience score plunges from 82.4 to 48.1 (-34.3 points). Video streaming and gaming QoS severely impaired.',
      icon: <TrendingDown className="w-3.5 h-3.5 text-rose-400" />,
      metric: 'CXS: 82.4 ➔ 48.1 (-34.3 pts)',
      color: 'border-rose-500/40 text-rose-400 bg-rose-500/10'
    },
    {
      step: 6,
      label: 'REVENUE AT RISK',
      badge: 'ARPU IMPACT',
      timeOffset: '+1.5s',
      summary: 'Business impact quantification evaluates monthly subscription ARPU exposure.',
      detail: 'Estimated revenue at risk evaluated at 12,500 DZD monthly recurring revenue; includes 12 corporate VIP enterprise accounts.',
      icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
      metric: '12,500 DZD Monthly Exposure',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
    },
    {
      step: 7,
      label: 'INCIDENT CREATED',
      badge: 'ALARM AGGREGATION',
      timeOffset: '+1.8s',
      summary: 'Alarm suppression engine registers a canonical incident rather than 7 standalone alerts.',
      detail: `Canonical incident INC-0001 registered: "${selectedWilaya} Cell Cluster Degradation". Raw radio alarms deduplicated.`,
      icon: <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />,
      metric: 'INC-0001 Deduplicated',
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10'
    },
    {
      step: 8,
      label: 'P1/P2 PRIORITY',
      badge: 'DYNAMIC FORMULATION',
      timeOffset: '+2.1s',
      summary: 'Multi-factor operational formulation computes urgency and initializes SLA countdown.',
      detail: 'Priority score calculated at 88.5/100 (40% Network + 25% Customers + 20% Revenue). Classified as P1-CRITICAL with 60-minute SLA.',
      icon: <Clock className="w-3.5 h-3.5 text-rose-400" />,
      metric: 'P1 — CRITICAL (60m SLA)',
      color: 'border-rose-500/40 text-rose-400 bg-rose-500/10'
    },
    {
      step: 9,
      label: 'AI ASSESSMENT',
      badge: '6-QUESTION BRIEF',
      timeOffset: '+2.4s',
      summary: 'Automated synthesis generates structured root cause analysis and technical evidence.',
      detail: 'Structured 6-question operational brief answers what happened, where, subscriber blast radius, and root cause indicators with 84% confidence.',
      icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
      metric: 'AI Confidence: 84%',
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10'
    },
    {
      step: 10,
      label: 'RECOMMENDED ACTION',
      badge: 'DUAL PLAYBOOK',
      timeOffset: '+2.7s',
      summary: 'Engineering remediation and proactive customer retention actions formulated.',
      detail: 'Dispatch Tier 2 Microwave Transmission field team and execute automated carrier failover to 2600MHz on SITE-SAI-001.',
      icon: <Wrench className="w-3.5 h-3.5 text-sky-400" />,
      metric: 'Carrier Failover + Field Team',
      color: 'border-sky-500/40 text-sky-400 bg-sky-500/10'
    },
    {
      step: 11,
      label: 'ITSM WORK ORDER',
      badge: 'ENTERPRISE BRIDGE',
      timeOffset: '+3.0s',
      summary: 'Normalized eTOM/ITIL ticket dispatched to enterprise service management system.',
      detail: 'ServiceNow ticket INC-SNOW-89421 dispatched to RAN_ENGINEERING_TIER_2 with full diagnostic payload and subscriber impact.',
      icon: <Send className="w-3.5 h-3.5 text-emerald-400" />,
      metric: 'ServiceNow / Jira Dispatched',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
    }
  ];

  // Auto-play interval for causal chain
  useEffect(() => {
    if (isPlayingChain) {
      timerRef.current = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= causalChainSteps.length) {
            setIsPlayingChain(false);
            setChainCompleted(true);
            return prev;
          }
          return prev + 1;
        });
      }, 550);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlayingChain]);

  if (!isOpen) return null;

  const handleRunScenario = async () => {
    setIsRunning(true);
    setChainCompleted(false);
    setActiveStep(1);
    setFeedback('Injecting operational scenario...');

    try {
      if (selectedScenario === 'nominal') {
        const res = await fetch('/api/simulation/reset', { method: 'POST' });
        if (res.ok) {
          setFeedback('Nominal baseline successfully restored across all sectors.');
          onScenarioApplied('All network sectors restored to nominal operations.');
          setActiveStep(1);
          setChainCompleted(true);
        }
      } else {
        const res = await fetch('/api/simulation/scenario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenario: selectedScenario,
            severity: currentSeverity,
            wilaya: selectedWilaya
          })
        });
        if (res.ok) {
          const data = await res.json();
          setFeedback(`Scenario active in ${selectedWilaya}: Cascade running live through 11 operational nodes.`);
          onScenarioApplied(data.status || `Injected scenario into ${selectedWilaya}.`);
          // Start the live chain animation
          setIsPlayingChain(true);
        }
      }
    } catch (e: any) {
      setFeedback(`Error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const currentStepData = causalChainSteps[activeStep - 1] || causalChainSteps[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  OPERATIONS SCENARIO CENTER
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  FLAGSHIP DEMO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Trigger controlled network degradation scenarios and trace the 11-step operational intelligence loop in real time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split into Simulator Controls (Left/Top) & Live Causal Chain (Right/Bottom) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          
          {/* LEFT: SCENARIO SIMULATOR CONTROLS (4 cols on lg) */}
          <div className="lg:col-span-5 p-5 space-y-5 bg-slate-950/40">
            <div>
              <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-sky-400 block mb-1">
                DEMO CONTROLLER
              </span>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                SCENARIO SIMULATOR
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Configure degradation vector and launch closed-loop incident progression.
              </p>
            </div>

            {/* Scenario Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                Scenario
              </label>
              <div className="relative">
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value as ScenarioType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 font-semibold cursor-pointer appearance-none pr-8"
                >
                  {scenarios.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                {selectedScenario === 'nominal' 
                  ? 'Clears all simulated anomalies and restores 100% nominal baselines.' 
                  : 'Degrades physical transport or radio carrier layer in targeted wilaya.'}
              </p>
            </div>

            {/* Region Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                Region
              </label>
              <div className="relative">
                <select
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 font-semibold cursor-pointer appearance-none pr-8"
                >
                  {wilayas.map((w) => (
                    <option key={w.name} value={w.name}>
                      {w.name} (Wilaya {w.code} — {w.sites})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Severity Slider */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Severity
                </label>
                <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                  currentSeverity === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : currentSeverity === 'HIGH'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                }`}>
                  {currentSeverity}
                </span>
              </div>

              {/* Slider Track and Markers */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={severityIndex}
                  onChange={(e) => setSeverityIndex(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 px-0.5">
                  <span className={severityIndex === 0 ? 'text-sky-400 font-bold' : ''}>LOW</span>
                  <span className={severityIndex === 1 ? 'text-sky-300 font-bold' : ''}>MEDIUM</span>
                  <span className={severityIndex === 2 ? 'text-amber-400 font-bold' : ''}>HIGH</span>
                  <span className={severityIndex === 3 ? 'text-rose-400 font-bold' : ''}>CRITICAL</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                {currentSeverity === 'CRITICAL'
                  ? 'Triggers P1 Operational Priority, 60m SLA timer, and executive escalation.'
                  : 'Triggers P2/P3 monitoring or standard operational queue.'}
              </p>
            </div>

            {/* Run Button */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={handleRunScenario}
                disabled={isRunning}
                className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-4 h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
                <span>{isRunning ? 'INJECTING SCENARIO...' : 'RUN SCENARIO'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedScenario('nominal');
                  setSeverityIndex(0);
                  handleRunScenario();
                }}
                disabled={isRunning}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Nominal Baseline</span>
              </button>
            </div>

            {feedback && (
              <div className="text-xs bg-sky-950/80 border border-sky-500/40 text-sky-200 p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            {/* Quick Links */}
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Post-Scenario Actions
              </span>
              <div className="flex flex-col gap-1.5">
                {onOpenIncidentDetail && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenIncidentDetail();
                    }}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer text-left"
                  >
                    <span className="font-semibold text-xs flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <span>Deep Incident Evidence Console</span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                )}
                {onNavigateToOperations && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToOperations();
                    }}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer text-left"
                  >
                    <span className="font-semibold text-xs flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-sky-400" />
                      <span>View Live Operations Grid</span>
                    </span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: THE LIVE CAUSAL CHAIN (7 cols on lg) */}
          <div className="lg:col-span-7 p-5 flex flex-col bg-slate-950/20">
            {/* Causal Chain Header & Player Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-sky-400" />
                    <span>LIVE OPERATIONAL CAUSAL CHAIN</span>
                  </h4>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    Step {activeStep} of {causalChainSteps.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Real-time progression from physical network degradation to ITSM work order creation.
                </p>
              </div>

              {/* Player Controls */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsPlayingChain(!isPlayingChain)}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
                >
                  {isPlayingChain ? (
                    <>
                      <Pause className="w-3 h-3 text-amber-400" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-sky-400" />
                      <span>{activeStep === causalChainSteps.length ? 'Replay' : 'Play'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStep((p) => Math.max(1, p - 1))}
                  disabled={activeStep <= 1}
                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 cursor-pointer"
                >
                  Prev
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStep((p) => Math.min(causalChainSteps.length, p + 1))}
                  disabled={activeStep >= causalChainSteps.length}
                  className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Currently Active Step Highlight Box */}
            <div className="my-4 p-3.5 bg-slate-900/90 rounded-xl border border-slate-700/80 shadow-md">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center font-mono">
                    {currentStepData.step}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {currentStepData.label}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {currentStepData.badge}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  {currentStepData.metric}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentStepData.detail}
              </p>
            </div>

            {/* The 11 Steps List: Live Vertical Chain with Down Arrows */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-1 font-mono text-xs">
              {causalChainSteps.map((node, index) => {
                const isActive = activeStep === node.step;
                const isPassed = activeStep > node.step;

                return (
                  <div key={node.step} className="flex flex-col">
                    <div
                      onClick={() => setActiveStep(node.step)}
                      className={`p-2.5 rounded-lg border transition cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'border-sky-400 bg-sky-500/15 ring-1 ring-sky-400 text-white shadow-md'
                          : isPassed
                          ? 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                          : 'border-slate-900 bg-slate-950/20 text-slate-500 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                          isActive 
                            ? 'bg-sky-500 text-slate-950 animate-pulse' 
                            : isPassed 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {node.step}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-xs ${isActive ? 'text-sky-300' : isPassed ? 'text-slate-200' : 'text-slate-400'}`}>
                              {node.label}
                            </span>
                            <span className="text-[9px] px-1 py-0.1 rounded font-mono bg-slate-800/80 text-slate-400">
                              {node.timeOffset}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-sans truncate max-w-sm">
                            {node.summary}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[11px] font-bold font-mono-num ${isActive ? 'text-sky-400' : isPassed ? 'text-slate-300' : 'text-slate-500'}`}>
                          {node.metric}
                        </span>
                      </div>
                    </div>

                    {/* Down Arrow between nodes */}
                    {index < causalChainSteps.length - 1 && (
                      <div className="flex justify-center my-0.5">
                        <ArrowDown className={`w-3 h-3 ${isPassed ? 'text-sky-500/70' : 'text-slate-700'}`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Status bar */}
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className={`w-3.5 h-3.5 ${chainCompleted || activeStep === causalChainSteps.length ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>
                  {activeStep === causalChainSteps.length 
                    ? 'Loop complete: Closed-loop workflow validated.' 
                    : `Simulating step ${activeStep} of 11...`}
                </span>
              </span>

              {activeStep === causalChainSteps.length && onOpenIncidentDetail && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenIncidentDetail();
                  }}
                  className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-md transition cursor-pointer flex items-center gap-1"
                >
                  <span>Inspect Incident</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">
            AI-Powered Telecom Operations & Customer Impact Intelligence Platform
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
