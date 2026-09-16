import React from 'react';
import { Database, ShieldAlert, CheckCircle2, XCircle, Info, X } from 'lucide-react';

interface SyntheticDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyntheticDataModal: React.FC<SyntheticDataModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Data Environment Transparency
              </h3>
              <p className="text-[11px] text-amber-400 font-mono">
                SYNTHETIC / SIMULATED BENCHMARK
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200 leading-relaxed">
            TelecomAI 2.0 uses mathematically calibrated synthetic datasets and 3GPP RAN distributions modeled after Algerian administrative wilayas for research, algorithmic validation, and executive demonstrations.
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Data Type:</span>
              <span className="font-mono font-bold text-sky-400">Synthetic / Simulated</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Real Operator Data:</span>
              <span className="flex items-center gap-1 font-mono font-bold text-slate-300">
                <XCircle className="w-3.5 h-3.5 text-rose-400" /> No
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Real Subscriber Data (PII):</span>
              <span className="flex items-center gap-1 font-mono font-bold text-slate-300">
                <XCircle className="w-3.5 h-3.5 text-rose-400" /> No
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Real Network Connection:</span>
              <span className="flex items-center gap-1 font-mono font-bold text-slate-300">
                <XCircle className="w-3.5 h-3.5 text-rose-400" /> No
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Platform Purpose:</span>
              <span className="font-mono font-bold text-emerald-400">Research / Prototype / Demonstration</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 block">Why Algerian Wilayas?</span>
            <p>
              Algerian geographic wilayas (e.g. Saïda, Oran, Algiers, Constantine) provide authentic topography (coastal urban density vs. High-Plateaux microwave backhaul links) to prove multi-tier telecom correlation without exposing confidential operator network infrastructure.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg transition cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
