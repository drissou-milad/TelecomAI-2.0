import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Search, 
  Filter, 
  RotateCw, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  ChevronDown,
  Layers,
  Radio,
  FileText,
  AlertOctagon,
  Clock,
  Send,
  Users,
  DollarSign,
  Activity,
  Server
} from 'lucide-react';

export interface AuditEventItem {
  id: string;
  timestamp: string;
  timeString: string;
  eventType: string;
  entityId: string;
  details: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  metadata?: Record<string, any>;
}

interface LiveEventFeedProps {
  onClose?: () => void;
  onSelectIncident?: (incidentId: string) => void;
}

export const LiveEventFeed: React.FC<LiveEventFeedProps> = ({
  onClose,
  onSelectIncident
}) => {
  const [events, setEvents] = useState<AuditEventItem[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const url = filterType === 'ALL' 
        ? '/api/events?limit=80' 
        : `/api/events?limit=80&type=${filterType}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.events) {
          setEvents(data.events);
          setLastRefreshed(new Date().toLocaleTimeString());
        }
      }
    } catch (e) {
      console.warn('Failed to fetch audit events:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, [filterType]);

  const filteredEvents = events.filter(e => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.eventType.toLowerCase().includes(q) ||
      e.entityId.toLowerCase().includes(q) ||
      e.details.toLowerCase().includes(q) ||
      e.timeString.toLowerCase().includes(q)
    );
  });

  const getEventBadge = (type: string, severity: string) => {
    switch (type) {
      case 'ANOMALY_DETECTED':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: <AlertOctagon className="w-3 h-3 text-rose-400" />,
          label: 'ANOMALY_DETECTED'
        };
      case 'CELL_IMPACT_CALCULATED':
        return {
          bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          icon: <Server className="w-3 h-3 text-sky-400" />,
          label: 'CELL_IMPACT'
        };
      case 'CUSTOMER_IMPACT_CALCULATED':
        return {
          bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          icon: <Users className="w-3 h-3 text-indigo-400" />,
          label: 'CUSTOMER_IMPACT'
        };
      case 'BUSINESS_IMPACT_CALCULATED':
      case 'IMPACT_CALCULATED':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <DollarSign className="w-3 h-3 text-emerald-400" />,
          label: 'BUSINESS_IMPACT'
        };
      case 'INCIDENT_CREATED':
        return {
          bg: 'bg-purple-600/20 text-purple-200 border-purple-600/50',
          icon: <ShieldAlert className="w-3 h-3 text-purple-400" />,
          label: 'INCIDENT_CREATED'
        };
      case 'PRIORITY_ASSIGNED':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: <Clock className="w-3 h-3 text-rose-400" />,
          label: 'PRIORITY_ASSIGNED'
        };
      case 'AI_ANALYSIS_COMPLETED':
        return {
          bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: <Sparkles className="w-3 h-3 text-cyan-400" />,
          label: 'AI_ANALYSIS'
        };
      case 'RECOMMENDATION_GENERATED':
        return {
          bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          icon: <Activity className="w-3 h-3 text-sky-400" />,
          label: 'RECOMMENDATION'
        };
      case 'ITSM_WORK_ORDER_CREATED':
      case 'ENGINEERING_DISPATCHED':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <Send className="w-3 h-3 text-emerald-400" />,
          label: 'ITSM_WORK_ORDER'
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: <FileText className="w-3 h-3 text-slate-400" />,
          label: type
        };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl mb-4 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                NOC Audit Log & Real-Time Operational Event Timeline
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                CLOSED-LOOP
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Deterministic sequence trace: Anomaly Detected ➔ Blast Radius ➔ Incident ➔ Priority ➔ AI Assessment ➔ Playbook ➔ ITSM Order
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={fetchEvents}
            disabled={isLoading}
            className="flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3 h-3 text-sky-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-800 transition cursor-pointer"
            >
              Minimize
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: 'All Timeline Events' },
            { id: 'ANOMALY_DETECTED', label: 'Anomalies' },
            { id: 'CELL_IMPACT_CALCULATED', label: 'Cell Impact' },
            { id: 'CUSTOMER_IMPACT_CALCULATED', label: 'Customer Impact' },
            { id: 'INCIDENT_CREATED', label: 'Incidents' },
            { id: 'AI_ANALYSIS_COMPLETED', label: 'AI Decisions' },
            { id: 'ITSM_WORK_ORDER_CREATED', label: 'ITSM Work Orders' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`text-xs px-2.5 py-1 rounded-md transition cursor-pointer ${
                filterType === tab.id
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter by Cell, INC-0001, etc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 font-mono"
          />
        </div>
      </div>

      {/* Events List */}
      <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 font-mono text-xs">
        {filteredEvents.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            No audit events found matching the selected filter.
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const badge = getEventBadge(evt.eventType, evt.severity);
            const isIncident = evt.entityId.startsWith('INC-');
            return (
              <div 
                key={evt.id} 
                className="px-4 py-2.5 hover:bg-slate-800/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="text-slate-400 font-bold text-[11px] shrink-0 font-mono">
                    {evt.timeString}
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 shrink-0 ${badge.bg}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isIncident && onSelectIncident ? (
                      <button
                        onClick={() => onSelectIncident(evt.entityId)}
                        className="text-sky-400 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        <span>{evt.entityId}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    ) : (
                      <span className="text-slate-200 font-bold bg-slate-800/80 px-1.5 py-0.2 rounded text-[11px] border border-slate-700">
                        {evt.entityId}
                      </span>
                    )}

                    <span className="text-slate-300 font-sans text-xs">
                      {evt.details}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                    evt.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                    evt.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                    evt.severity === 'MEDIUM' ? 'bg-purple-500/20 text-purple-300' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {evt.severity}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Showing {filteredEvents.length} events • Ring buffer capacity: 250</span>
        <span>Deterministic sequence verifiable</span>
      </div>
    </div>
  );
};
