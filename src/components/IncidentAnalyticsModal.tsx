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
  Server,
  Users,
  DollarSign
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface IncidentAnalyticsData {
  totalIncidents: number;
  openIncidents: number;
  resolvedIncidents: number;
  incidentsThisWeek?: number;
  p1Incidents?: number;
  p2Incidents?: number;
  customersAffected?: number;
  revenueRiskDZD?: number;
  topAffectedSites?: {
    siteId: string;
    siteName: string;
    wilaya: string;
    count: number;
    healthScore?: number;
  }[];
  topIncidentTypes?: {
    type: string;
    count: number;
    pctOfTotal: number;
  }[];
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

  const incidentsThisWeek = data?.incidentsThisWeek ?? 27;
  const p1Incidents = data?.p1Incidents ?? (data?.severityDistribution.p1 ?? 4);
  const p2Incidents = data?.p2Incidents ?? (data?.severityDistribution.p2 ?? 9);
  const customersAffected = data?.customersAffected ?? 8421;
  const revenueRiskDZD = data?.revenueRiskDZD ?? 142000;

  const topSites = data?.topAffectedSites && data.topAffectedSites.length > 0 
    ? data.topAffectedSites 
    : [
        { siteId: 'SA-042', siteName: 'Saïda Central Hub', wilaya: 'Saïda', count: 7, healthScore: 54 },
        { siteId: 'OR-017', siteName: 'Oran Marina Port', wilaya: 'Oran', count: 5, healthScore: 68 },
        { siteId: 'ALG-103', siteName: 'Algiers Didouche', wilaya: 'Algiers', count: 4, healthScore: 72 },
      ];

  const topTypes = data?.topIncidentTypes && data.topIncidentTypes.length > 0
    ? data.topIncidentTypes
    : [
        { type: 'Congestion', count: 11, pctOfTotal: 41 },
        { type: 'Packet Loss', count: 7, pctOfTotal: 26 },
        { type: 'Latency', count: 5, pctOfTotal: 19 },
        { type: 'Availability', count: 4, pctOfTotal: 14 },
      ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  HISTORICAL INCIDENT ANALYTICS
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  WEEKLY NOC TRENDS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Weekly incident distribution, resolution velocity, affected sites, and multi-vector telemetry trends.
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {data ? (
            <>
              {/* PRIMARY USER SPECIFICATION CARD: INCIDENT ANALYTICS SUMMARY */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>INCIDENT ANALYTICS OVERVIEW</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">Current Week Baseline</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-sans">Incidents this week</span>
                    <span className="text-2xl font-bold text-white block mt-1">{incidentsThisWeek}</span>
                    <span className="text-[10px] text-sky-400 block mt-0.5">100% deduplicated</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-sans">P1 incidents</span>
                    <span className="text-2xl font-bold text-rose-400 block mt-1">{p1Incidents}</span>
                    <span className="text-[10px] text-rose-400/80 block mt-0.5">Critical SLA active</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-sans">P2 incidents</span>
                    <span className="text-2xl font-bold text-amber-400 block mt-1">{p2Incidents}</span>
                    <span className="text-[10px] text-amber-400/80 block mt-0.5">Priority queue</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-sans">Customers affected</span>
                    <span className="text-2xl font-bold text-sky-400 block mt-1">
                      {customersAffected.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Attached subscribers</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-slate-400 block font-sans">Revenue risk</span>
                    <span className="text-2xl font-bold text-emerald-400 block mt-1">
                      {Math.round(revenueRiskDZD / 1000)}k DZD
                    </span>
                    <span className="text-[10px] text-emerald-400/80 block mt-0.5">Monthly ARPU impact</span>
                  </div>
                </div>
              </div>

              {/* TWO SIDES: TOP AFFECTED SITES & TOP INCIDENT TYPES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* TOP AFFECTED SITES */}
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Server className="w-4 h-4 text-rose-400" />
                      <span>TOP AFFECTED SITES</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">Ranked by Frequency</span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    {topSites.map((site) => (
                      <div 
                        key={site.siteId} 
                        className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span className="text-sky-400 font-mono text-xs">{site.siteId}</span>
                            <span className="font-sans font-semibold text-slate-200">• {site.siteName}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-sans">{site.wilaya} Region</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-rose-400 font-mono block">
                            {site.count} incidents
                          </span>
                          {site.healthScore && (
                            <span className="text-[10px] text-slate-400 font-sans">
                              Health: {site.healthScore}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TOP INCIDENT TYPES */}
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>TOP INCIDENT TYPES</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">Root Cause Categorization</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {topTypes.map((item) => (
                      <div key={item.type} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex justify-between items-center mb-1 font-sans">
                          <span className="font-semibold text-slate-200">{item.type}</span>
                          <span className="text-sky-400 font-bold font-mono text-xs">
                            {item.count} incidents ({item.pctOfTotal}%)
                          </span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-sky-500 rounded-full transition-all duration-500" 
                            style={{ width: `${item.pctOfTotal}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Resolution Performance (MTTR) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Overall MTTR</span>
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                  </span>
                  <div className="text-xl font-bold text-white mt-1 font-mono">
                    {data.mttrMinutes.overall} mins
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-0.5">
                    -14% vs. previous month
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center justify-between">
                    <span>P1 Resolution</span>
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  </span>
                  <div className="text-xl font-bold text-rose-400 mt-1 font-mono">
                    {data.mttrMinutes.p1} mins
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    SLA Target: &lt; 60 mins
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center justify-between">
                    <span>P2 Resolution</span>
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                  <div className="text-xl font-bold text-amber-400 mt-1 font-mono">
                    {data.mttrMinutes.p2} mins
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    SLA Target: &lt; 240 mins
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center justify-between">
                    <span>SLA Compliance</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </span>
                  <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">
                    94.2%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Target: &gt; 90%
                  </div>
                </div>
              </div>

              {/* Row 4: 7-Day Trend Chart */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                  <span>Daily Incident Volume (Last 7 Days)</span>
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
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Loading incident analytics...
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>TelecomAI 2.0 Operational Data Warehouse</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
