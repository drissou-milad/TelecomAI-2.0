import React from 'react';
import { 
  Radio, 
  Server, 
  Activity, 
  Users, 
  UserX, 
  TrendingDown, 
  DollarSign, 
  ShieldAlert, 
  ArrowDown, 
  ArrowRight,
  Info,
  Layers
} from 'lucide-react';

interface ImpactChainProps {
  cellId?: string;
  siteId?: string;
  siteName?: string;
  networkImpactText?: string;
  affectedCount?: number;
  highRiskCount?: number;
  cxsBefore?: number;
  cxsAfter?: number;
  revenueRiskDZD?: number;
  priority?: string;
  onInspectIncident?: () => void;
  orientation?: 'vertical' | 'horizontal';
}

export const ImpactChain: React.FC<ImpactChainProps> = ({
  cellId = 'SA-042',
  siteId = 'SA-SITE-07',
  siteName = 'Saïda Central Hub',
  networkImpactText = 'High latency (+38%) + packet loss (+12%)',
  affectedCount = 1284,
  highRiskCount = 187,
  cxsBefore = 78,
  cxsAfter = 54,
  revenueRiskDZD = 12500,
  priority = 'P1',
  onInspectIncident,
  orientation = 'horizontal'
}) => {
  const steps = [
    {
      id: 'step-network',
      stage: 'NETWORK',
      category: 'RAN Sector',
      title: `Cell ${cellId}`,
      subtitle: 'Degraded Sector',
      type: 'ML Anomaly',
      typeBadge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      icon: <Radio className="w-4 h-4 text-purple-400" />,
      color: 'border-purple-500/30 bg-purple-950/20'
    },
    {
      id: 'step-site',
      stage: 'SITE',
      category: 'Infrastructure',
      title: siteId,
      subtitle: siteName,
      type: 'Topology',
      typeBadge: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      icon: <Server className="w-4 h-4 text-sky-400" />,
      color: 'border-sky-500/30 bg-sky-950/20'
    },
    {
      id: 'step-impact',
      stage: 'NETWORK IMPACT',
      category: 'QoS Degradation',
      title: 'Transport Jitter',
      subtitle: networkImpactText,
      type: 'Telemetry',
      typeBadge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: <Activity className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-950/20'
    },
    {
      id: 'step-customers',
      stage: 'CUSTOMERS',
      category: 'Blast Radius',
      title: `${affectedCount.toLocaleString()} Affected`,
      subtitle: 'Attached Subscribers',
      type: 'Deterministic',
      typeBadge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      icon: <Users className="w-4 h-4 text-indigo-400" />,
      color: 'border-indigo-500/30 bg-indigo-950/20'
    },
    {
      id: 'step-high-risk',
      stage: 'HIGH-RISK CUSTOMERS',
      category: 'Churn Susceptibility',
      title: `${highRiskCount} High Risk`,
      subtitle: 'Critical Churn Prob > 70%',
      type: 'ML Prediction',
      typeBadge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      icon: <UserX className="w-4 h-4 text-rose-400" />,
      color: 'border-rose-500/30 bg-rose-950/20'
    },
    {
      id: 'step-cxs',
      stage: 'CUSTOMER EXPERIENCE',
      category: 'Experience Index',
      title: `CXS ${cxsBefore} → ${cxsAfter}`,
      subtitle: `-${Math.round(((cxsBefore - cxsAfter) / cxsBefore) * 100)}% Quality Collapse`,
      type: 'CXS Formula',
      typeBadge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: <TrendingDown className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-950/20'
    },
    {
      id: 'step-business',
      stage: 'BUSINESS IMPACT',
      category: 'Financial Risk',
      title: `${revenueRiskDZD.toLocaleString()} DZD`,
      subtitle: 'Estimated Monthly Exposure',
      type: 'Deterministic',
      typeBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-950/20'
    },
    {
      id: 'step-incident',
      stage: 'INCIDENT',
      category: 'Triage Priority',
      title: `${priority} — CRITICAL`,
      subtitle: '60-Min SLA Triggered',
      type: 'AI Prioritization',
      typeBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
      color: 'border-rose-500/40 bg-rose-950/30'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Causal Impact Chain: Network → Customer → Business
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono font-bold">
              Core Intelligence Loop
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualizes how a physical cellular anomaly propagates through network topology to subscriber churn risk and quantified revenue exposure.
          </p>
        </div>

        {onInspectIncident && (
          <button
            onClick={onInspectIncident}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer self-start sm:self-auto shrink-0"
            id="impact-chain-inspect-btn"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Inspect Canonical Incident</span>
          </button>
        )}
      </div>

      {/* Chain Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-2.5">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          return (
            <div key={step.id} className="flex flex-col relative group">
              {/* Card */}
              <div className={`p-3 rounded-lg border ${step.color} transition-all hover:scale-[1.02] flex flex-col justify-between h-full relative`}>
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      {step.stage}
                    </span>
                    {step.icon}
                  </div>

                  <div className="text-sm font-bold text-white tracking-tight truncate" title={step.title}>
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2" title={step.subtitle}>
                    {step.subtitle}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono font-semibold ${step.typeBadge}`}>
                    {step.type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    #{idx + 1}
                  </span>
                </div>
              </div>

              {/* Arrow Connector (for desktop layout) */}
              {!isLast && (
                <div className="hidden xl:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 items-center justify-center pointer-events-none text-slate-600">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend & Clarification */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-500 font-semibold">Intelligence Types:</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-slate-300 font-mono">ML Anomaly / Churn</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-slate-300 font-mono">Deterministic Spatial Correlation</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span className="text-slate-300 font-mono">AI Triage & Playbooks</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-sky-400">
          <Info className="w-3.5 h-3.5" />
          <span>Incident Priority mathematically derived from blast radius + revenue</span>
        </div>
      </div>
    </div>
  );
};
