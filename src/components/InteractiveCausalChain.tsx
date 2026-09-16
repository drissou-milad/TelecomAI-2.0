import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft,
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
  Sliders,
  HelpCircle,
  RotateCcw,
  Zap,
  FileText,
  ExternalLink
} from 'lucide-react';

interface InteractiveCausalChainProps {
  onOpenIncidentDetail?: () => void;
  onOpenScenarioCenter?: () => void;
  onNavigateToOperations?: () => void;
  onSimulateDegrade?: () => void;
  onResetBaseline?: () => void;
}

export const InteractiveCausalChain: React.FC<InteractiveCausalChainProps> = ({
  onOpenIncidentDetail,
  onOpenScenarioCenter,
  onNavigateToOperations,
  onSimulateDegrade,
  onResetBaseline
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);

  const steps = [
    {
      num: 1,
      name: 'NETWORK DEGRADATION',
      shortName: 'Degradation',
      icon: <Activity className="w-3.5 h-3.5 text-rose-400" />,
      badge: 'RAN TELEMETRY',
      kpi: 'Latency +38% • Loss +12%',
      summary: 'Microwave backhaul transport hop experiences carrier signal attenuation and frame discard.',
      color: 'border-rose-500/40 text-rose-400',
      proof: {
        headline: 'Physical Microwave Transport Attenuation',
        baseline: 'Nominal Baseline: 28.1 ms Latency • 0.38% Packet Loss • PRB 58%',
        degraded: 'Active Telemetry: 48.5 ms (+38.4%) • 1.76% Packet Loss (+12.1%) • PRB 94.2%',
        formula: 'Δ_Latency = (L_t - L_baseline) / L_baseline = +38.4% (Exceeds 3GPP SLA threshold > 20%)',
        pills: ['Transport: 18 GHz Microwave', 'Hop: Saïda Central Hub ➔ Sector Array', 'Signal: -14 dBm Fade Margin'],
        ctaText: 'Trigger Saïda Simulation'
      }
    },
    {
      num: 2,
      name: 'ANOMALY DETECTED',
      shortName: 'Anomaly',
      icon: <Radio className="w-3.5 h-3.5 text-amber-400" />,
      badge: 'ISOLATION FOREST',
      kpi: 'Score: -0.18 • Contam 0.05',
      summary: 'Unsupervised Isolation Forest flags multi-dimensional telemetry vector anomaly exceeding 5-sigma.',
      color: 'border-amber-500/40 text-amber-400',
      proof: {
        headline: 'Unsupervised Multidimensional Isolation',
        baseline: 'Nominal Isolation Forest Score: +0.48 (Nominal Cluster)',
        degraded: 'Detected Outlier Score: -0.184 (Decision Boundary: < 0.0, 5-sigma divergence)',
        formula: 's(x, n) = 2^(-E(h(x))/c(n)) = -0.184 with 94.2% Anomaly Confidence',
        pills: ['Trees: 150 Estimators', 'Contamination Rate: 0.037', 'Features: Latency, Loss, PRB, Jitter'],
        ctaText: 'Inspect ML Specs'
      }
    },
    {
      num: 3,
      name: 'CELL/SITE IDENTIFIED',
      shortName: 'Topology',
      icon: <Server className="w-3.5 h-3.5 text-sky-400" />,
      badge: 'TOPOLOGY MAP',
      kpi: '4 Cells • 2 Sites (Saïda Hub)',
      summary: 'Topological deduplication isolates 7 degraded sectors sharing backhaul hub SITE-SAI-001.',
      color: 'border-sky-500/40 text-sky-400',
      proof: {
        headline: 'Spatial Topology & Fiber/Microwave Uplink Correlation',
        baseline: 'Nominal Topology: 38 Sectors across 12 Base Stations in Wilaya Saïda',
        degraded: 'Isolated Cluster: SITE-SAI-001 (Saïda Centre Hub) + 4 Primary Cells (CELL-SAI-001..004)',
        formula: 'Cluster = { c ∈ Cells | Hub(c) == SITE-SAI-001 ∧ AnomalyScore(c) < -0.10 } (7 sectors)',
        pills: ['Technology: LTE-A 1800MHz + 2600MHz', 'Azimuths: 0°, 120°, 240°', 'Uplink: MW-HOP-SAI-01'],
        ctaText: 'View Network Map'
      }
    },
    {
      num: 4,
      name: 'CUSTOMERS AFFECTED',
      shortName: 'Blast Radius',
      icon: <Users className="w-3.5 h-3.5 text-indigo-400" />,
      badge: 'SPATIAL JOIN',
      kpi: '1,284 Attached • 187 Risk',
      summary: 'Cross-domain correlation links 1,284 active subscribers with coverage footprint of degraded sectors.',
      color: 'border-indigo-500/40 text-indigo-400',
      proof: {
        headline: 'Network-to-Customer Blast-Radius Correlation',
        baseline: 'Baseline Serving Load: 1,320 registered devices under nominal QoS',
        degraded: 'Exposed Cohort: 1,284 Active Subscribers • 237 Flagged High Churn Risk (Historical low NPS)',
        formula: 'BlastRadius = |⋃_{c ∈ Cluster} RegisteredSubscribers(c)| = 1,284 Subscribers (12 Enterprise VIPs)',
        pills: ['1,047 Consumer Postpaid/Prepaid', '237 High-Risk Churn Cohort', '12 Corporate VIP Lines'],
        ctaText: 'Inspect Customer 360'
      }
    },
    {
      num: 5,
      name: 'CXS DECREASE',
      shortName: 'CXS Drop',
      icon: <TrendingDown className="w-3.5 h-3.5 text-rose-400" />,
      badge: 'EXPERIENCE SCORE',
      kpi: 'CXS: 82.4 ➔ 48.1 (-34.3)',
      summary: 'Subscriber Customer Experience Score drops due to buffered streaming and dropped call rates.',
      color: 'border-rose-500/40 text-rose-400',
      proof: {
        headline: 'Customer Experience Index (CXS / CEI) Degradation',
        baseline: 'Nominal Average CXS: 82.4 / 100 (Optimal streaming & call clarity)',
        degraded: 'Degraded Cohort CXS: 48.1 / 100 (-34.3 points, Critical QoE Threshold)',
        formula: 'CXS = 100 - (0.45 × Δ_Latency_Norm + 0.35 × Δ_Loss_Norm + 0.20 × DropCall_Norm) = 48.1',
        pills: ['VoLTE MOS: 4.2 ➔ 2.1', 'Video Buffer Rate: +420%', 'Dropped Calls: 0.12% ➔ 4.8%'],
        ctaText: 'View CXS Attribution'
      }
    },
    {
      num: 6,
      name: 'ESTIMATED REVENUE AT RISK',
      shortName: 'Revenue Risk',
      icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
      badge: 'SYNTHETIC EXPOSURE',
      kpi: '12,500 DZD Exposure',
      summary: 'Financial correlation quantifies monthly recurring revenue risk including 12 enterprise accounts.',
      color: 'border-emerald-500/40 text-emerald-400',
      proof: {
        headline: 'Synthetic Financial Revenue Exposure & ARPU Quantification',
        baseline: 'Nominal Churn-Weighted Exposure: 0 DZD (Within SLA Tolerances)',
        degraded: 'Active Estimated Revenue at Risk: 12,500 DZD / Month (Synthetic estimation)',
        formula: 'RevenueExposure = ∑ (ARPU_i × P(Churn_i | CXS_i < 50)) = 12,500 DZD / month',
        pills: ['Average ARPU: 1,450 DZD', '12 Enterprise Accounts (ARPU 6,800 DZD)', '90-Day LTV Risk: 37,500 DZD'],
        ctaText: 'Review Revenue Model'
      }
    },
    {
      num: 7,
      name: 'INCIDENT CREATED',
      shortName: 'Incident',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />,
      badge: 'ALARM DEDUP',
      kpi: 'INC-0001 Created',
      summary: 'Alarm suppression engine registers canonical operational incident INC-0001 rather than raw alert floods.',
      color: 'border-purple-500/40 text-purple-400',
      proof: {
        headline: 'Alarm Suppression & Canonical Incident Clustering',
        baseline: '7 Raw Telemetry Alarms: 4x Latency High, 2x PRB Saturation, 1x Loss Spike',
        degraded: 'Suppressed into 1 Single Canonical Incident: INC-0001 ("Saïda Backhaul Transport Degradation")',
        formula: 'DeduplicationRatio = 7 Raw Sector Alarms : 1 Canonical Incident (85.7% Noise Reduction)',
        pills: ['ID: INC-0001', 'State: INVESTIGATING', 'Site: SITE-SAI-001 (Saïda Centre)'],
        ctaText: 'Open Incident Modal'
      }
    },
    {
      num: 8,
      name: 'P1/P2 PRIORITY',
      shortName: 'Priority P1',
      icon: <Clock className="w-3.5 h-3.5 text-rose-400" />,
      badge: 'DYNAMIC SLA',
      kpi: 'P1 — CRITICAL (60m SLA)',
      summary: 'Multi-factor formulation scores urgency at 88.5/100, triggering P1 SLA and executive notification.',
      color: 'border-rose-500/40 text-rose-400',
      proof: {
        headline: 'Evidence-Based Multi-Factor Priority Classification',
        baseline: 'Default Baseline Threshold: P3 (Informational, SLA 240 mins)',
        degraded: 'Calculated Priority Score: 88.5 / 100 ➔ Classified as P1-CRITICAL (SLA 60 mins)',
        formula: 'PriorityScore = (0.35 × UsersFactor: 95) + (0.30 × RevenueFactor: 90) + (0.20 × TechSeverity: 85) + (0.15 × VIPSLA: 80) = 88.5',
        pills: ['Subscribers: 1,284 (>1,000 threshold)', 'Revenue: 12,500 DZD (>10k threshold)', 'SLA Countdown: 54m Remaining'],
        ctaText: 'Why This Priority?'
      }
    },
    {
      num: 9,
      name: 'AI ASSESSMENT',
      shortName: 'AI Brief',
      icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
      badge: '6-QUESTION BRIEF',
      kpi: 'Confidence: 84%',
      summary: '6-Question operational briefing synthesized with root cause diagnosis and evidence breakdown.',
      color: 'border-cyan-500/40 text-cyan-400',
      proof: {
        headline: 'Structured 6-Question Operational AI Synthesis',
        baseline: 'Raw Alert Logs without Context',
        degraded: 'AI Diagnostic Brief Generated with 84% Multi-Factor Confidence Score',
        formula: 'Confidence = 0.40(TelemetryCorrel: 0.92) + 0.30(TopologyMatch: 0.88) + 0.30(HistoricalPattern: 0.70) = 0.84',
        pills: ['Root Cause: MW Fade Margin Drop', 'Blast: 4 Cells / 1,284 Users', 'Urgency: High (P1 SLA)'],
        ctaText: 'Read 6-Question Brief'
      }
    },
    {
      num: 10,
      name: 'RECOMMENDED ACTION',
      shortName: 'Playbook',
      icon: <Wrench className="w-3.5 h-3.5 text-sky-400" />,
      badge: 'DUAL PLAYBOOK',
      kpi: 'Failover + Field Tech',
      summary: 'Automated recommendation for 2600MHz carrier failover alongside field technician transmission dispatch.',
      color: 'border-sky-500/40 text-sky-400',
      proof: {
        headline: 'Dual-Track Engineering Remediation & Customer Care Retention Playbooks',
        baseline: 'Manual NOC Investigation (Average MTTR 145 mins)',
        degraded: 'Automated Dual Playbook Dispatched (Reduces MTTR to 38 mins, -73% Downtime)',
        formula: 'Track A (Network): Reroute to 2600MHz secondary carrier • Track B (Care): Proactive SMS data credit to 237 high-risk users',
        pills: ['Tech Action: RF Carrier Failover', 'Field Dispatch: Transmission Crew 3', 'Care: 500 DZD Bonus Data Voucher'],
        ctaText: 'Review Dual Playbook'
      }
    },
    {
      num: 11,
      name: 'ITSM WORK ORDER',
      shortName: 'ITSM Order',
      icon: <Send className="w-3.5 h-3.5 text-emerald-400" />,
      badge: 'ITSM PROTOTYPE',
      kpi: 'ServiceNow-Compatible',
      summary: 'ServiceNow-compatible and Jira-compatible work-order payload generated in prototype sandbox.',
      color: 'border-emerald-500/40 text-emerald-400',
      proof: {
        headline: 'ITSM Integration Prototype & ServiceNow-Compatible Payload',
        baseline: 'No Enterprise System Sync',
        degraded: 'ServiceNow-compatible work order INC-SNOW-89421 dispatched to in-memory prototype registry',
        formula: 'JSON eTOM/ITIL Payload: { ticket_id, priority: "P1", blast_radius: 1284, root_cause, sync_state: "ASSIGNED" }',
        pills: ['Connector: ITSM Prototype Adapter', 'Status: ASSIGNED / IN_PROGRESS', 'Work Notes: Pre-Populated with Evidence'],
        ctaText: 'Inspect ITSM Payload'
      }
    },
  ];

  // Auto-play timer for Flagship Demo walkthrough
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
    }, 2800);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const current = steps[activeStep - 1] || steps[0];

  const handleStepAction = () => {
    if (activeStep === 7 || activeStep === 8 || activeStep === 9 || activeStep === 10 || activeStep === 11) {
      if (onOpenIncidentDetail) onOpenIncidentDetail();
    } else if (activeStep === 3) {
      if (onNavigateToOperations) onNavigateToOperations();
    } else if (activeStep === 1 && onSimulateDegrade) {
      onSimulateDegrade();
    } else if (onOpenScenarioCenter) {
      onOpenScenarioCenter();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 shadow-xl">
      {/* Top Banner & Flagship Walkthrough Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white tracking-wide">
                11-Step Operational Intelligence Flow
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                FLAGSHIP STORY
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                Step {activeStep} of 11 • Saïda Microwave Incident
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Follow physical radio degradation ➔ AI anomaly detection ➔ customer blast radius ➔ P1 prioritization ➔ enterprise ITSM dispatch.
            </p>
          </div>
        </div>

        {/* Flagship Controls: Auto Walkthrough, Step Buttons, Reset */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Previous Step */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setActiveStep((prev) => (prev > 1 ? prev - 1 : steps.length));
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
            title="Previous step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Auto Walkthrough Play / Pause */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            id="flagship-demo-autoplay-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
              isPlaying
                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                : 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border-sky-500/40 shadow-sm'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>Pause Demo</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-sky-400" />
                <span>Run 3-Min Walkthrough</span>
              </>
            )}
          </button>

          {/* Next Step */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setActiveStep((prev) => (prev < steps.length ? prev + 1 : 1));
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
            title="Next step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Evidence / Why P1 Quick Trigger */}
          <button
            type="button"
            onClick={() => setShowEvidenceModal(true)}
            id="flagship-why-p1-btn"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg text-xs font-semibold border border-rose-800/50 transition cursor-pointer"
            title="View quantitative triggers explaining why P1 was assigned"
          >
            <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Why P1 Priority?</span>
          </button>

          {onOpenScenarioCenter && (
            <button
              type="button"
              onClick={onOpenScenarioCenter}
              id="flagship-scenarios-btn"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Scenarios</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Steps Bar (Interactive flow) */}
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

      {/* Expanded Active Step Visual Proof Panel */}
      <div className="mt-2 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col gap-3">
        {/* Step Header & Headline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/60">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-sky-400 shrink-0">
              {current.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Step {current.num}: {current.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {current.badge}
                </span>
                <span className="text-[11px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                  {current.kpi}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-300 mt-0.5">
                {current.proof.headline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {onOpenIncidentDetail && (
              <button
                type="button"
                onClick={onOpenIncidentDetail}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>Incident INC-0001</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleStepAction}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span>{current.proof.ctaText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Detailed Evidence Grid: Baseline vs Degraded & Mathematical Formulation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Left Column: Baseline vs Degraded State */}
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1.5">
              TELEMETRY STATE COMPARISON
            </span>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-[11px] font-mono">{current.proof.baseline}</span>
              </div>
              <div className="flex items-center gap-2 text-rose-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                <span className="text-[11px] font-mono">{current.proof.degraded}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Quantitative Model / Formula */}
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1.5">
              MATHEMATICAL EVIDENCE & THRESHOLDS
            </span>
            <p className="text-[11px] font-mono text-sky-300 bg-slate-950 p-1.5 rounded border border-slate-800">
              {current.proof.formula}
            </p>
          </div>
        </div>

        {/* Evidence Metadata Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {current.proof.pills.map((pill, idx) => (
            <span 
              key={idx} 
              className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* "Why P1-CRITICAL?" Evidence Breakdown Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-slate-200">
            <button
              onClick={() => setShowEvidenceModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Why P1-CRITICAL Priority? — Quantitative Evidence Breakdown
                </h3>
                <p className="text-xs text-slate-400">
                  Traceable multi-factor scoring triggers justifying operational escalation for Incident INC-0001.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 mb-6">
              {/* Factor 1: Subscriber Blast Radius */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-indigo-400 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">1. Subscriber Blast Radius Exceeded (&gt;1,000 threshold)</h4>
                    <p className="text-[11px] text-slate-400">
                      1,284 subscribers actively registered in the 4 degraded sectors of Saïda Central Hub. 237 subscribers flagged high churn risk.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 shrink-0">
                  Triggered: 1,284
                </span>
              </div>

              {/* Factor 2: Financial Revenue Exposure */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <DollarSign className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">2. Monthly Recurring Revenue Risk (&gt;10,000 DZD threshold)</h4>
                    <p className="text-[11px] text-slate-400">
                      Evaluated monthly recurring revenue exposure at 12,500 DZD/month across affected subscribers, including 12 enterprise accounts.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 shrink-0">
                  Triggered: 12,500 DZD
                </span>
              </div>

              {/* Factor 3: Radio Transport Telemetry Severity */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Activity className="w-4 h-4 text-rose-400 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">3. Network Telemetry Degradation (+38% Latency, +12% Packet Loss)</h4>
                    <p className="text-[11px] text-slate-400">
                      Physical microwave backhaul hop attenuation exceeds 5-sigma statistical boundary (Isolation Forest score -0.184).
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 shrink-0">
                  Critical Anomaly
                </span>
              </div>

              {/* Factor 4: Corporate VIP SLA Breach Risk */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">4. Enterprise Contractual SLA (60-Minute Resolution Window)</h4>
                    <p className="text-[11px] text-slate-400">
                      12 corporate enterprise accounts with zero-tolerance business SLA attached to SITE-SAI-001. Requires automated executive escalation.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                  60m P1 SLA
                </span>
              </div>
            </div>

            {/* Formula Summary Box */}
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-sky-500/30 mb-6">
              <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-wider block mb-1">
                OPERATIONAL PRIORITY EQUATION
              </span>
              <p className="text-xs font-mono text-slate-200">
                Score = (0.35 × 95) + (0.30 × 90) + (0.20 × 85) + (0.15 × 80) = <strong className="text-rose-400">88.5 / 100</strong>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Score ≥ 80 automatically classifies incident as <strong>P1-CRITICAL</strong>, initializes a 60-minute SLA countdown, and dispatches a high-urgency ServiceNow work order.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEvidenceModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
              >
                Close
              </button>
              {onOpenIncidentDetail && (
                <button
                  type="button"
                  onClick={() => {
                    setShowEvidenceModal(false);
                    onOpenIncidentDetail();
                  }}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md"
                >
                  <span>Open Incident INC-0001 Detail</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

