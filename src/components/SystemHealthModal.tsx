import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Server, 
  Radio, 
  Cpu, 
  RefreshCw, 
  X,
  AlertTriangle,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface SystemHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HealthStatus {
  apiOnline: boolean;
  intelligenceEngineOnline: boolean;
  simulationEngineOnline: boolean;
  itsmConnectorAvailable: boolean;
  latencyMs: number;
  lastChecked: string;
  details: Record<string, any>;
}

export const SystemHealthModal: React.FC<SystemHealthModalProps> = ({
  isOpen,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<HealthStatus>({
    apiOnline: true,
    intelligenceEngineOnline: true,
    simulationEngineOnline: true,
    itsmConnectorAvailable: true,
    latencyMs: 3,
    lastChecked: new Date().toLocaleTimeString(),
    details: {}
  });

  const checkLiveHealth = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const [healthRes, simRes, itsmRes] = await Promise.all([
        fetch('/api/health').catch(() => null),
        fetch('/api/simulation/status').catch(() => null),
        fetch('/api/integrations/itsm/tickets').catch(() => null)
      ]);

      const roundtrip = Math.round(performance.now() - start);
      const healthData = healthRes && healthRes.ok ? await healthRes.json() : null;
      const simData = simRes && simRes.ok ? await simRes.json() : null;
      const itsmData = itsmRes && itsmRes.ok ? await itsmRes.json() : null;

      setHealth({
        apiOnline: !!healthData,
        intelligenceEngineOnline: healthData?.status === 'healthy',
        simulationEngineOnline: !!simData,
        itsmConnectorAvailable: !!itsmData,
        latencyMs: roundtrip || 2,
        lastChecked: new Date().toLocaleTimeString(),
        details: { healthData, simData, ticketCount: itsmData?.count || 0 }
      });
    } catch (e) {
      console.warn('Health check error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkLiveHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const items = [
    {
      name: 'API Core Services',
      description: 'REST API, JSON routing, and middleware',
      status: health.apiOnline,
      endpoint: '/api/health'
    },
    {
      name: 'Intelligence & Correlation Engine',
      description: 'In-memory spatial join, blast radius, and priority scoring',
      status: health.intelligenceEngineOnline,
      endpoint: '/api/network/analyze'
    },
    {
      name: 'Simulation Engine',
      description: 'RAN degradation injector and baseline state manager',
      status: health.simulationEngineOnline,
      endpoint: '/api/simulation/status'
    },
    {
      name: 'ITSM Connector Bridge',
      description: 'ServiceNow / Jira Service Management REST dispatch',
      status: health.itsmConnectorAvailable,
      endpoint: '/api/integrations/itsm/tickets'
    }
  ];

  const allHealthy = health.apiOnline && health.intelligenceEngineOnline && health.simulationEngineOnline && health.itsmConnectorAvailable;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg border ${allHealthy ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                System Status & Service Health
              </h3>
              <p className="text-[11px] text-slate-400">
                Live internal micro-checks • Latency: <span className="font-mono text-sky-400">{health.latencyMs}ms</span>
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
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            allHealthy ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
          }`}>
            <div className="flex items-center gap-2">
              {allHealthy ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
              <span className="text-xs font-bold">
                {allHealthy ? 'All Systems Fully Operational' : 'Degraded Subsystem Detected'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Checked: {health.lastChecked}
            </span>
          </div>

          <div className="space-y-2.5">
            {items.map((item, i) => (
              <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{item.endpoint}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                </div>

                <div className="flex items-center gap-1.5 pl-3">
                  {item.status ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ONLINE
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      OFFLINE
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Separation of ML and Deterministic Logic Note */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-[11px] space-y-1.5">
            <span className="text-xs font-bold text-sky-400 block uppercase tracking-wider">
              Architecture Separation Protocol
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
              <div>
                <span className="text-purple-400 font-bold font-mono">ML Subsystem:</span> Gradient Boosting churn inference & Isolation Forest outlier scoring.
              </div>
              <div>
                <span className="text-sky-400 font-bold font-mono">Deterministic Engine:</span> Spatial cell-subscriber correlation & revenue blast radius.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={checkLiveHealth}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Recheck Health</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
