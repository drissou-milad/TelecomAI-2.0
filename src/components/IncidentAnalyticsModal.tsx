import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  X, 
  Clock, 
  Flame, 
  RotateCw, 
  MapPin, 
  TrendingUp, 
  Radio, 
  ShieldAlert, 
  CheckCircle2,
  AlertTriangle,
  Server
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

interface IncidentAnalyticsData {
  totalIncidents: number;
  openIncidents: number;
  resolvedIncidents: number;
  mttrMinutes: {
    overall: number;
    p1: number;
    p2: number;
    p3: number;
    p4: number;
  };
  severityDistribution: {
    p1: number;
    p2: number;
    p3: number;
    p4: number;
  };
  dailyTrend: {
    date: string;
    day: string;
    incidents: number;
    affectedCustomers: number;
    revenueRiskDZD: number;
  }[];
  topProblematicSites: {
    siteId: string;
    siteName: string;
    wilaya: string;
    incidentCount: number;
    healthScore: number;
  }[];
  topProblematicCells: {
    cellId: string;
    siteName: string;
    wilaya: string;
    anomalyFrequency: number;
    lastIncident: string;
  }[];
  incidentsByWilaya: {
    wilaya: string;
    count: number;
    p1Count: number;
    status: string;
  }[];
  recurringRootCauses: {
    type: string;
    count: number;
    pctOfTotal: number;
  }[];
}

interface IncidentAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentAnalyticsModal: React.FC<IncidentAnalyticsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [data, setData] = useState<IncidentAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/incidents/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.warn('Failed to load incident analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>NOC Historical Incident Analytics</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  ROLLING 7 DAYS
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Mean Time to Resolution (MTTR), recurring root causes, problematic cell sectors, and regional trends
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAnalytics}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Refresh Analytics"
            >
              <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {data ? (
            <>
              {/* Row 1: High Level MTTR & Distribution KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Overall MTTR</span>
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                  </span>
                  <div className="text-xl font-bold text-white mt-1 font-mono-num">
                    {data.mttrMinutes.overall} mins
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-0.5">
                    -14% vs. previous month
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center justify-between">
                    <span>P1 Mean Resolution</span>
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  </span>
                  <div className="text-xl font-bold text-rose-400 mt-1 font-mono-num">
                    {data.mttrMinutes.p1} mins
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    SLA Target: &lt; 60 mins
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Total Incidents</span>
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                  <div className="text-xl font-bold text-white mt-1 font-mono-num">
                    {data.totalIncidents}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {data.openIncidents} open • {data.resolvedIncidents} resolved
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Severity Split</span>
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                  </span>
                  <div className="text-sm font-bold text-white mt-1 font-mono-num flex items-center gap-1.5">
                    <span className="text-rose-400">{data.severityDistribution.p1} P1</span>
                    <span>•</span>
                    <span className="text-amber-400">{data.severityDistribution.p2} P2</span>
                    <span>•</span>
                    <span className="text-sky-400">{data.severityDistribution.p3} P3</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    AI Auto-Prioritized
                  </div>
                </div>
              </div>

              {/* Row 2: 7-Day Trend Chart */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                  <span>Daily Incident Volume & Subscriber Exposure (Last 7 Days)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Aggregation: 24h</span>
                </h4>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                        formatter={(val: any, name: any) => [val, name === 'incidents' ? 'Incidents' : 'Exposed Users']}
                      />
                      <Bar dataKey="incidents" fill="#38bdf8" radius={[4, 4, 0, 0]} name="incidents" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Row 3: Top Problematic Sites & Recurring Causes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Problematic Sites */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-rose-400" />
                    <span>Top Problematic Base Station Sites</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    {data.topProblematicSites.map(s => (
                      <div key={s.siteId} className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span className="text-sky-400 font-mono">{s.siteId}</span>
                            <span>• {s.siteName}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{s.wilaya}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-rose-400 font-mono-num">
                            {s.incidentCount} incidents
                          </span>
                          <div className="text-[10px] text-slate-400">Health: {s.healthScore}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recurring Root Causes */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Recurring Incident Root Causes</span>
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    {data.recurringRootCauses.map((r, i) => (
                      <div key={i} className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-slate-300">{r.type}</span>
                          <span className="text-sky-400 font-bold font-mono-num">{r.pctOfTotal}% ({r.count})</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-sky-500 rounded-full" 
                            style={{ width: `${r.pctOfTotal}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Loading incident analytics...
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono-num">
          <span>TelecomAI 2.0 Operational Data Warehouse</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
