import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, 
  Users, 
  Radio, 
  Cpu, 
  Info, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  SignalHigh,
  Bell,
  Workflow,
  ChevronDown,
  Flame,
  Send,
  Sliders,
  Database,
  Layers,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentPage?: string;
  activePage?: string;
  onNavigate: (page: string) => void;
  userRole: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onToggleRole?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  anomalyCount?: number;
  anomaliesCount?: number;
  activeIncidentsCount?: number;
  onOpenSystemHealth?: () => void;
  onOpenSyntheticData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  activePage,
  onNavigate,
  userRole,
  onRoleChange,
  onToggleRole,
  searchQuery = '',
  onSearchChange,
  anomalyCount,
  anomaliesCount,
  activeIncidentsCount = 2,
  onOpenSystemHealth,
  onOpenSyntheticData
}) => {
  const current = activePage || currentPage || 'overview';
  const effectiveAnomalyCount = anomaliesCount !== undefined ? anomaliesCount : (anomalyCount || 0);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleToggle = (role: UserRole) => {
    if (onRoleChange) {
      onRoleChange(role);
    } else if (onToggleRole) {
      onToggleRole();
    }
  };

  const isMoreActive = ['predictions', 'about', 'itsm', 'system_admin'].includes(current);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-3 sm:px-5 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap lg:flex-nowrap">
        {/* Left: Professional Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-2.5 group text-left cursor-pointer select-none"
            id="nav-logo-btn"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center font-black text-slate-950 text-base shadow-sm shadow-sky-500/20">
              T
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-white">
                  Telecom<span className="text-sky-400">AI</span>
                </span>
                <span className="px-1.5 py-0.2 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                  2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                Network & Customer Impact Intelligence Platform
              </p>
            </div>
          </button>
        </div>

        {/* Center: Simplified Primary Navigation Tabs (Overview, Network, Customers, Incidents, AI Analysis, More) */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 shrink-0 order-3 lg:order-2 w-full lg:w-auto justify-start sm:justify-center border-t lg:border-t-0 border-slate-800/80 pt-2 lg:pt-0">
          {/* 1. Overview */}
          <button
            id="nav-tab-overview"
            onClick={() => onNavigate('overview')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer select-none ${
              current === 'overview' || current === 'dashboard'
                ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm shadow-sky-500/5 ring-1 ring-sky-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Activity className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="tracking-wide">Overview</span>
          </button>

          {/* 2. Network */}
          <button
            id="nav-tab-network"
            onClick={() => onNavigate('network')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer select-none ${
              current === 'network'
                ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm shadow-sky-500/5 ring-1 ring-sky-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Radio className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="tracking-wide">Network</span>
            {effectiveAnomalyCount > 0 && (
              <span className="flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white shadow-sm shadow-rose-500/40">
                {effectiveAnomalyCount}
              </span>
            )}
          </button>

          {/* 3. Customers */}
          <button
            id="nav-tab-customers"
            onClick={() => onNavigate('customers')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer select-none ${
              current === 'customers'
                ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm shadow-sky-500/5 ring-1 ring-sky-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="tracking-wide">Customers</span>
          </button>

          {/* 4. Incidents */}
          <button
            id="nav-tab-incidents"
            onClick={() => onNavigate('incidents')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer select-none ${
              current === 'incidents' || current === 'operations'
                ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm shadow-sky-500/5 ring-1 ring-sky-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Flame className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="tracking-wide">Incidents</span>
            {activeIncidentsCount > 0 && (
              <span className="flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white shadow-sm shadow-rose-500/40">
                {activeIncidentsCount}
              </span>
            )}
          </button>

          {/* 5. AI Analysis */}
          <button
            id="nav-tab-ai-analysis"
            onClick={() => onNavigate('ai_analysis')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer select-none ${
              current === 'ai_analysis'
                ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm shadow-sky-500/5 ring-1 ring-sky-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="tracking-wide">AI Analysis</span>
          </button>

          {/* 6. More Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              id="nav-tab-more"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                isMoreActive
                  ? 'bg-slate-800 text-sky-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180 text-sky-400' : 'text-slate-400'}`} />
            </button>

            {isMoreOpen && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800/80 mb-1">
                  Technical & System
                </div>

                <button
                  onClick={() => {
                    onNavigate('predictions');
                    setIsMoreOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-800 transition cursor-pointer ${
                    current === 'predictions' ? 'text-sky-400 font-bold bg-slate-800/60' : 'text-slate-300'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <div className="font-semibold">Model Performance</div>
                    <div className="text-[10px] text-slate-500">ROC-AUC 0.961, SHAP explainability</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigate('about');
                    setIsMoreOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-800 transition cursor-pointer ${
                    current === 'about' ? 'text-sky-400 font-bold bg-slate-800/60' : 'text-slate-300'
                  }`}
                >
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <div className="font-semibold">Architecture</div>
                    <div className="text-[10px] text-slate-500">TelecomAI 2.0 closed-loop design</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigate('itsm');
                    setIsMoreOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-800 transition cursor-pointer ${
                    current === 'itsm' ? 'text-sky-400 font-bold bg-slate-800/60' : 'text-slate-300'
                  }`}
                >
                  <Send className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <div className="font-semibold">ITSM Bridge</div>
                    <div className="text-[10px] text-slate-500">ServiceNow & Jira work orders</div>
                  </div>
                </button>

                <div className="my-1 border-t border-slate-800" />

                <button
                  onClick={() => {
                    if (onOpenSystemHealth) onOpenSystemHealth();
                    setIsMoreOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-800 transition cursor-pointer text-slate-300"
                >
                  <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-semibold">System / Admin</div>
                    <div className="text-[10px] text-slate-500">Live service health & status</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (onOpenSyntheticData) onOpenSyntheticData();
                    setIsMoreOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-800 transition cursor-pointer text-slate-300"
                >
                  <Database className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-semibold">Data Transparency</div>
                    <div className="text-[10px] text-slate-500">Synthetic environment disclosure</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Controls, Synthetic Badge, Role Switcher & Live NOC Status */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 order-2 lg:order-3 ml-auto lg:ml-0">
          {/* Quick Search */}
          {onSearchChange && (
            <div className="relative hidden xl:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="global-search-input"
                type="text"
                placeholder="Search cell or subscriber..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-36 lg:w-44 bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all font-mono-num"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Permanent Synthetic Environment Indicator (Requirement 12) */}
          <button
            onClick={onOpenSyntheticData}
            title="Click to view Synthetic Data Environment Transparency panel"
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition cursor-pointer text-[11px] font-mono font-semibold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Synthetic</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              id="role-analyst-btn"
              onClick={() => handleRoleToggle('Analyst')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                userRole === 'Analyst'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Analyst view"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Analyst</span>
            </button>
            <button
              id="role-admin-btn"
              onClick={() => handleRoleToggle('Admin')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                userRole === 'Admin'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Admin view"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>

          {/* Explicit System Status Pill (Requirement 15) */}
          <button
            onClick={onOpenSystemHealth}
            title="Click to inspect Live System & Subsystem Health"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 hover:border-slate-700 text-xs transition cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-slate-300 font-semibold text-[11px]">Online</span>
          </button>
        </div>
      </div>
    </header>
  );
};
