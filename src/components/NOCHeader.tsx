import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Radio, 
  Users, 
  DollarSign, 
  AlertTriangle,
  Flame,
  Sliders,
  BarChart3,
  ListFilter
} from 'lucide-react';

interface NOCHeaderProps {
  networkHealth: number;
  activeAnomalies: number;
  affectedCustomers: number;
  revenueAtRiskDZD: number;
  openIncidentsCount: number;
  activeP1Count: number;
  lastUpdated: string;
  onManualRefresh: () => void;
  onOpenScenarioCenter?: () => void;
  onOpenAnalytics?: () => void;
  onToggleEventFeed?: () => void;
  isEventFeedOpen?: boolean;
}

export const NOCHeader: React.FC<NOCHeaderProps> = ({
  networkHealth,
  activeAnomalies,
  affectedCustomers,
  revenueAtRiskDZD,
  openIncidentsCount,
  activeP1Count,
  lastUpdated,
  onManualRefresh,
  onOpenScenarioCenter,
  onOpenAnalytics,
  onToggleEventFeed,
  isEventFeedOpen = false
}) => {
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(6); // seconds
  const [countdown, setCountdown] = useState<number>(6);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Determine system operational state
  const state: 'NORMAL' | 'DEGRADED' | 'CRITICAL' = 
    activeP1Count > 0 || activeAnomalies >= 5 
      ? 'CRITICAL' 
      : activeAnomalies > 0 || networkHealth < 90 
        ? 'DEGRADED' 
        : 'NORMAL';

  const onManualRefreshRef = useRef(onManualRefresh);
  useEffect(() => {
    onManualRefreshRef.current = onManualRefresh;
  }, [onManualRefresh]);

  // Countdown timer and auto-refresh trigger
  useEffect(() => {
    if (!autoRefresh) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Schedule side effects outside the state updater cycle
          setTimeout(() => {
            setIsRefreshing(true);
            onManualRefreshRef.current();
            setTimeout(() => setIsRefreshing(false), 600);
          }, 0);
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefresh, refreshInterval]);

  const handleManualClick = () => {
    setIsRefreshing(true);
    setCountdown(refreshInterval);
    onManualRefreshRef.current();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 mb-4 shadow-xl">
      {/* Top row: System state, Live Indicator, Auto-refresh controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                state === 'CRITICAL' ? 'bg-rose-400' : state === 'DEGRADED' ? 'bg-amber-400' : 'bg-emerald-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                state === 'CRITICAL' ? 'bg-rose-500' : state === 'DEGRADED' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
            </span>
            <span className="font-bold text-xs uppercase tracking-widest text-slate-300 font-mono-num">
              NOC LIVE CONSOLE
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* System State Banner */}
          <div className={`px-2.5 py-0.5 rounded-md font-bold text-xs flex items-center gap-1.5 font-mono-num ${
            state === 'CRITICAL'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : state === 'DEGRADED'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          }`}>
            {state === 'CRITICAL' ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>STATE: CRITICAL</span>
              </>
            ) : state === 'DEGRADED' ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>STATE: DEGRADED</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>STATE: NORMAL</span>
              </>
            )}
          </div>

          <span className="text-xs text-slate-400 hidden md:inline">
            {state === 'CRITICAL'
              ? 'P1 Regional incident active • Automated mitigation recommended'
              : state === 'DEGRADED'
                ? 'Minor telemetry jitter • Monitoring radio sectors'
                : 'All cellular radio access networks operating within nominal parameters'}
          </span>
        </div>

        {/* Right side controls: Last updated, countdown, controls */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 font-mono-num">
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Updated: {lastUpdated || 'Live'}</span>
          </div>

          <div className="h-3.5 w-px bg-slate-700" />

          {/* Auto Refresh toggle & countdown */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`text-[11px] font-semibold transition cursor-pointer ${
                autoRefresh ? 'text-sky-400' : 'text-slate-500'
              }`}
              title="Toggle automatic 6-second polling"
            >
              Auto-Sync: {autoRefresh ? 'ON' : 'PAUSED'}
            </button>
            {autoRefresh && (
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1 py-0.2 rounded font-mono">
                {countdown}s
              </span>
            )}
          </div>

          {/* Refresh Now Button */}
          <button
            onClick={handleManualClick}
            disabled={isRefreshing}
            id="noc-refresh-btn"
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition cursor-pointer disabled:opacity-50"
            title="Poll fresh network telemetry and incidents immediately"
          >
            <RefreshCw className={`w-3 h-3 text-sky-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          {/* Scenario Center Quick Trigger */}
          {onOpenScenarioCenter && (
            <button
              onClick={onOpenScenarioCenter}
              id="noc-scenarios-btn"
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/50 rounded transition cursor-pointer font-sans text-xs font-semibold"
            >
              <Sliders className="w-3 h-3 text-indigo-400" />
              <span>Scenarios</span>
            </button>
          )}

          {/* Analytics Trigger */}
          {onOpenAnalytics && (
            <button
              onClick={onOpenAnalytics}
              id="noc-analytics-btn"
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded transition cursor-pointer font-sans text-xs"
            >
              <BarChart3 className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
          )}

          {/* Live Event Feed Toggle */}
          {onToggleEventFeed && (
            <button
              onClick={onToggleEventFeed}
              id="noc-feed-btn"
              className={`flex items-center gap-1 px-2.5 py-1 rounded border transition cursor-pointer font-sans text-xs font-semibold ${
                isEventFeedOpen 
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <ListFilter className="w-3 h-3 text-sky-400" />
              <span>Audit Feed</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom KPI Bar: Key NOC Operational Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3">
        {/* Network Health */}
        <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/60">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Health Score</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-lg font-black font-mono-num ${
              networkHealth >= 90 ? 'text-emerald-400' : networkHealth >= 70 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {networkHealth}%
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-medium">RAN Aggregate</span>
          </div>
        </div>

        {/* Active Anomalies */}
        <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/60">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Active Anomalies</span>
            <Radio className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-lg font-black font-mono-num ${activeAnomalies > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
              {activeAnomalies}
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-medium">Sectors</span>
          </div>
        </div>

        {/* Active Incidents */}
        <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/60">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Open Incidents</span>
            <Flame className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-white font-mono-num">
              {openIncidentsCount}
            </span>
            {activeP1Count > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40">
                {activeP1Count} P1
              </span>
            )}
          </div>
        </div>

        {/* Affected Customers */}
        <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/60">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Affected Users</span>
            <Users className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-lg font-black font-mono-num ${affectedCustomers > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
              {affectedCustomers.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-medium">Subscribers</span>
          </div>
        </div>

        {/* Monthly Revenue Risk */}
        <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/60">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Revenue Exposure</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-lg font-black font-mono-num ${revenueAtRiskDZD > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
              {revenueAtRiskDZD.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-medium">DZD/mo</span>
          </div>
        </div>

        {/* Wilaya Hotspot */}
        <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/60">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Primary Hotspot</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-amber-300 truncate">
              {activeAnomalies > 0 ? 'Saïda (High-Plateaux)' : 'Nominal Network'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
