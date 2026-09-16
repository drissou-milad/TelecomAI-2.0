import React from 'react';
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
  Workflow
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
  activeIncidentsCount = 2
}) => {
  const current = activePage || currentPage || 'dashboard';
  const effectiveAnomalyCount = anomaliesCount !== undefined ? anomaliesCount : (anomalyCount || 0);

  const handleRoleToggle = (role: UserRole) => {
    if (onRoleChange) {
      onRoleChange(role);
    } else if (onToggleRole) {
      onToggleRole();
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-3 sm:px-5 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap lg:flex-nowrap">
        {/* Left: Professional Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onNavigate('dashboard')}
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
                Operations & Customer Impact Intelligence
              </p>
            </div>
          </button>
        </div>

        {/* Center: Main Navigation Tabs (Strictly Prevent Clipping) */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 shrink-0 order-3 lg:order-2 w-full lg:w-auto justify-start sm:justify-center border-t lg:border-t-0 border-slate-800/80 pt-2 lg:pt-0">
          <button
            id="nav-tab-dashboard"
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer select-none ${
              current === 'dashboard'
                ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm shadow-sky-500/5 ring-1 ring-sky-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Activity className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="tracking-wide">Dashboard</span>
          </button>

          <button
            id="nav-tab-operations"
            onClick={() => onNavigate('operations')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer select-none ${
              current === 'operations'
                ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm shadow-sky-500/5 ring-1 ring-sky-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Workflow className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="tracking-wide">Operations</span>
            {activeIncidentsCount > 0 && (
              <span className="flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white shadow-sm shadow-rose-500/40">
                {activeIncidentsCount}
              </span>
            )}
          </button>

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

          <button
            id="nav-tab-predictions"
            onClick={() => onNavigate('predictions')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer select-none ${
              current === 'predictions'
                ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm shadow-sky-500/5 ring-1 ring-sky-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="tracking-wide">AI Models</span>
          </button>

          <button
            id="nav-tab-about"
            onClick={() => onNavigate('about')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer select-none ${
              current === 'about'
                ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm shadow-sky-500/5 ring-1 ring-sky-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="tracking-wide">Architecture</span>
          </button>
        </nav>

        {/* Right: Controls, Role Switcher & Live NOC Status */}
        <div className="flex items-center gap-2.5 shrink-0 order-2 lg:order-3 ml-auto lg:ml-0">
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
                className="w-44 bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all font-mono-num"
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
              <span>Analyst</span>
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
              <span>Admin</span>
            </button>
          </div>

          {/* System Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-slate-900/80 rounded-lg border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-slate-300 font-semibold text-[11px]">Live NOC</span>
            </div>
            <span className="text-slate-700">|</span>
            <span className="text-amber-400/90 text-[10px] font-mono font-medium">Demo Mode</span>
          </div>
        </div>
      </div>
    </header>
  );
};
