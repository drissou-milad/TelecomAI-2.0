import React, { useState } from 'react';
import { 
  Sliders, 
  X, 
  Play, 
  RotateCcw, 
  Radio, 
  Layers, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  Server, 
  WifiOff, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

export type ScenarioType =
  | 'nominal'
  | 'cell_congestion'
  | 'backhaul_degradation'
  | 'high_latency'
  | 'packet_loss'
  | 'site_outage'
  | 'regional_degradation';

interface ScenarioCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onScenarioApplied: (resultText: string) => void;
}

export const ScenarioCenter: React.FC<ScenarioCenterProps> = ({
  isOpen,
  onClose,
  onScenarioApplied
}) => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>('backhaul_degradation');
  const [selectedSeverity, setSelectedSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('CRITICAL');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('Saida');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'nominal' as ScenarioType,
      title: 'Nominal Baseline',
      desc: 'All radio carriers, microwave hops, and fiber transport links operating within normal baseline parameters.',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      badge: 'STABLE',
      color: 'border-emerald-500/40 bg-emerald-500/5'
    },
    {
      id: 'backhaul_degradation' as ScenarioType,
      title: 'Backhaul Congestion',
      desc: 'Microwave transport link degradation (+38% latency, +12% packet loss), impacting multi-cell cluster.',
      icon: <Server className="w-4 h-4 text-rose-400" />,
      badge: 'RECOMMENDED DEMO',
      color: 'border-rose-500/40 bg-rose-500/5'
    },
    {
      id: 'cell_congestion' as ScenarioType,
      title: 'Cell Capacity Congestion',
      desc: 'Baseband PRB resource block utilization exceeds 94%, throughput drops, localized access queueing.',
      icon: <Radio className="w-4 h-4 text-amber-400" />,
      badge: 'RAN CAPACITY',
      color: 'border-amber-500/40 bg-amber-500/5'
    },
    {
      id: 'high_latency' as ScenarioType,
      title: 'High Latency / Jitter',
      desc: 'Fiber ring packet buffering and RTT surge (+65% latency spike), degrading gaming and VoLTE QoS.',
      icon: <Clock className="w-4 h-4 text-purple-400" />,
      badge: 'TRANSPORT',
      color: 'border-purple-500/40 bg-purple-500/5'
    },
    {
      id: 'packet_loss' as ScenarioType,
      title: 'RF Packet Loss & Fade',
      desc: 'Rain fade / feeder connector VSWR mismatch causing excessive frame discards (+16% packet loss).',
      icon: <Activity className="w-4 h-4 text-amber-400" />,
      badge: 'RADIO RF',
      color: 'border-amber-500/40 bg-amber-500/5'
    },
    {
      id: 'site_outage' as ScenarioType,
      title: 'Site Power Rectifier Outage',
      desc: 'Base station power failure, immediate zero availability on primary sectors, adjacent cell rollover.',
      icon: <WifiOff className="w-4 h-4 text-rose-500" />,
      badge: 'PHYSICAL OUTAGE',
      color: 'border-rose-600/50 bg-rose-600/10'
    },
    {
      id: 'regional_degradation' as ScenarioType,
      title: 'Regional Cluster Degradation',
      desc: 'Multi-site metropolitan cluster degradation causing widespread subscriber QoE decline.',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
      badge: 'METROPOLITAN',
      color: 'border-rose-500/40 bg-rose-500/5'
    }
  ];

  const wilayas = [
    { name: 'Saida', code: '20', region: 'High-Plateaux', sites: 48 },
    { name: 'Algiers', code: '16', region: 'North Metropolitan', sites: 512 },
    { name: 'Oran', code: '31', region: 'West Coastal', sites: 280 },
    { name: 'Tlemcen', code: '13', region: 'West Border', sites: 142 },
    { name: 'Constantine', code: '25', region: 'East Plateau', sites: 198 },
    { name: 'Sétif', code: '19', region: 'High-Plateaux East', sites: 210 }
  ];

  const handleRunScenario = async () => {
    setIsRunning(true);
    try {
      if (selectedScenario === 'nominal') {
        const res = await fetch('/api/simulation/reset', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setFeedback('Nominal baseline successfully restored across all sectors.');
          onScenarioApplied('All network sectors restored to nominal operations.');
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      } else {
        const res = await fetch('/api/simulation/scenario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenario: selectedScenario,
            severity: selectedSeverity,
            wilaya: selectedWilaya
          })
        });
        if (res.ok) {
          const data = await res.json();
          setFeedback(`Injected scenario into ${selectedWilaya} with ${selectedSeverity} severity.`);
          onScenarioApplied(data.status || `Injected scenario into ${selectedWilaya}.`);
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      }
    } catch (e: any) {
      setFeedback(`Error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>TelecomAI Scenario Simulator</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  SYNTHETIC LAB
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Inject controlled operational conditions into the telemetry bus to observe real-time AI reactions
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Step 1: Choose Scenario */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              1. Select Operational Scenario
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {scenarios.map((sc) => {
                const isSelected = selectedScenario === sc.id;
                return (
                  <div
                    key={sc.id}
                    onClick={() => setSelectedScenario(sc.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? `${sc.color} ring-1 ring-sky-400 border-sky-400 shadow-md`
                        : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          {sc.icon}
                          <span className="font-bold text-xs text-white">
                            {sc.title}
                          </span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {sc.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {sc.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Severity and Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            {/* Severity Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                2. Degradation Severity
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSelectedSeverity(sev)}
                    className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                      selectedSeverity === sev
                        ? sev === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500 ring-1 ring-rose-500'
                          : sev === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500 ring-1 ring-amber-500'
                            : 'bg-sky-500/20 text-sky-300 border-sky-500 ring-1 ring-sky-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 font-mono">
                {selectedSeverity === 'CRITICAL'
                  ? 'Triggers P1 Operational Priority and immediate ITSM escalation'
                  : 'Triggers P2/P3 monitoring or standard maintenance queue'}
              </p>
            </div>

            {/* Target Region */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                3. Target Algerian Wilaya
              </label>
              <select
                value={selectedWilaya}
                onChange={(e) => setSelectedWilaya(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono-num cursor-pointer"
              >
                {wilayas.map((w) => (
                  <option key={w.code} value={w.name}>
                    {w.name} (Wilaya {w.code} — {w.region}, {w.sites} Sites)
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1.5 font-mono">
                Targets specific sector clusters and attached subscriber profiles
              </p>
            </div>
          </div>

          {feedback && (
            <div className="text-xs bg-sky-950/80 border border-sky-500/40 text-sky-200 p-2.5 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span>{feedback}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedScenario('nominal');
              handleRunScenario();
            }}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Nominal</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRunScenario}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-bold transition shadow-md shadow-sky-500/20 cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Injecting Scenario...' : 'Run Scenario'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
