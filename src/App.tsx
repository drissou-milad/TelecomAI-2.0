import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SimulationController } from './components/SimulationController';
import { DashboardPage } from './pages/DashboardPage';
import { OperationsPage } from './pages/OperationsPage';
import { CustomersPage } from './pages/CustomersPage';
import { NetworkPage } from './pages/NetworkPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { AboutPage } from './pages/AboutPage';

import { 
  SEED_CUSTOMERS, 
  SEED_NETWORK_CELLS, 
  SYNTHETIC_WILAYA_SIMULATION, 
  LOADING_DASHBOARD_SUMMARY, 
  HOURLY_TRAFFIC_FORECAST 
} from './data/telecomData';
import { 
  INITIAL_INCIDENTS, 
  INITIAL_IMPACTS, 
  INITIAL_QOS_METRICS 
} from './data/operationsData';
import { getDashboardSummary, getChurnBenchmark } from './ml/mlEngine';
import { 
  Customer, 
  NetworkCell, 
  UserRole, 
  DashboardSummary, 
  ModelComparison,
  TelecomIncident,
  NetworkCustomerImpact,
  QoSMetrics
} from './types';
import { Sparkles, Terminal, ShieldCheck, Radio, Database } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('Admin');
  const [customers, setCustomers] = useState<Customer[]>(SEED_CUSTOMERS);
  const [cells, setCells] = useState<NetworkCell[]>(SEED_NETWORK_CELLS);
  const [incidents, setIncidents] = useState<TelecomIncident[]>(INITIAL_INCIDENTS);
  const [impacts, setImpacts] = useState<NetworkCustomerImpact[]>(INITIAL_IMPACTS);
  const [qosMetrics, setQosMetrics] = useState<QoSMetrics>(INITIAL_QOS_METRICS);
  const [summary, setSummary] = useState<DashboardSummary>(LOADING_DASHBOARD_SUMMARY);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [championModel, setChampionModel] = useState<ModelComparison | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('C10245');
  const [selectedCellId, setSelectedCellId] = useState<string>('CELL-TLM-034');

  const handleRefreshAllData = async () => {
    try {
      const [overviewRes, cellsRes, incidentsRes] = await Promise.all([
        fetch('/api/network/overview'),
        fetch('/api/network/cells'),
        fetch('/api/incidents')
      ]);

      if (overviewRes.ok) {
        const overview = await overviewRes.json();
        setSummary(prev => ({
          ...prev,
          networkHealth: overview.network_health_score,
          networkAnomalies: overview.detected_anomalies,
          revenueAtRiskDZD: overview.revenue_at_risk_dzd
        }));
      }

      if (cellsRes.ok) {
        const { cells: apiCells } = await cellsRes.json();
        if (apiCells && apiCells.length > 0) {
          const mappedCells: NetworkCell[] = apiCells.map((c: any) => ({
            cellId: c.cellId,
            siteId: c.siteId,
            siteName: c.siteName,
            wilaya: c.wilaya,
            technology: c.technology,
            frequencyBand: c.frequencyBand,
            azimuthDeg: c.azimuthDeg,
            status: c.status,
            healthScore: c.healthScore,
            users: c.currentTelemetry.connectedUsers,
            latencyMs: c.currentTelemetry.latencyMs,
            packetLossPct: c.currentTelemetry.packetLossPct,
            trafficMbps: c.currentTelemetry.trafficMbps,
            availabilityPct: c.currentTelemetry.availabilityPct,
            activeAlarms: c.activeAlarms,
            anomalyScore: c.status === 'anomaly' ? 84 : 12,
            anomalyReason: c.status === 'anomaly' ? 'Surge in packet loss and latency above regional baseline' : undefined
          }));
          setCells(mappedCells);
        }
      }

      if (incidentsRes.ok) {
        const { incidents: apiIncidents } = await incidentsRes.json();
        if (apiIncidents && apiIncidents.length > 0) {
          const mappedIncidents: TelecomIncident[] = apiIncidents.map((inc: any) => ({
            id: inc.incident_id,
            title: inc.title,
            priority: inc.priority === 'P1' ? 'P1-CRITICAL' : 'P2-HIGH',
            status: inc.status === 'RESOLVED' ? 'RESOLVED' : inc.status === 'DISPATCHED' ? 'DISPATCHED_TO_ITSM' : 'INVESTIGATING',
            cellId: inc.infrastructure.cellIds?.[0] || 'CELL-SAI-001',
            siteId: inc.infrastructure.siteIds?.[0] || 'SITE-SAI-01',
            siteName: 'Saïda Central Hub',
            wilaya: inc.infrastructure.wilaya,
            detectedAt: new Date(inc.detected_at).toLocaleTimeString(),
            impactedSubscribers: inc.customer_impact.affected_customers,
            vipAccountsCount: Math.round(inc.customer_impact.high_risk_customers * 0.1),
            revenueAtRiskDZD: inc.business_impact.revenue_at_risk,
            priorityScore: inc.business_impact.impact_score,
            anomalyScore: 84,
            rootCauseDiagnosis: inc.ai_analysis.assessment,
            recommendedAction: inc.ai_analysis.recommended_action,
            itsmTicket: inc.itsm_ticket ? {
              platform: inc.itsm_ticket.system === 'ServiceNow' ? 'ServiceNow' : 'Jira Service Management',
              externalTicketId: inc.itsm_ticket.ticket_id,
              dispatchedAt: new Date(inc.itsm_ticket.created_at).toLocaleTimeString(),
              syncStatus: 'SYNCHRONIZED',
              payloadSummary: `Work order dispatched to ${inc.itsm_ticket.system}`,
              assignedTeam: inc.itsm_ticket.assigned_group
            } : undefined
          }));
          setIncidents(mappedIncidents);
        }
      }
    } catch (e) {
      console.warn('TelecomAI 2.0 backend polling notice:', e);
    }
  };

  // Load headline KPIs from the backend on mount and sync 2.0 loop state
  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch((err) => setSummaryError(err.message || 'Failed to load dashboard summary.'));

    getChurnBenchmark()
      .then(({ models }) => setChampionModel(models.find(m => m.isChampion) || models[0] || null))
      .catch(() => {});

    handleRefreshAllData();
  }, []);

  // Navigate handler
  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update customer (e.g. from retention action). The demo-customer list here is a
  // small illustrative sample, separate from the full dataset the backend scores for
  // the headline KPIs above, so we don't try to keep them in perfect lockstep - we just
  // avoid re-introducing a hand-typed number.
  const handleUpdateCustomer = (updated: Customer) => {
    const updatedList = customers.map(c => c.id === updated.id ? updated : c);
    setCustomers(updatedList);
  };

  // Update cell (e.g. from NOC mitigation)
  const handleUpdateCell = (updated: NetworkCell) => {
    const updatedList = cells.map(c => c.cellId === updated.cellId ? updated : c);
    setCells(updatedList);

    // Recalculate anomaly count
    const anomaliesCount = updatedList.filter(c => c.status === 'anomaly').length;
    setSummary(prev => ({
      ...prev,
      networkAnomalies: anomaliesCount
    }));
  };

  // Update incident (e.g. from ITSM dispatch)
  const handleUpdateIncident = (updated: TelecomIncident) => {
    setIncidents(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  const activeP1Count = incidents.filter(i => i.priority === 'P1-CRITICAL' && i.status !== 'RESOLVED').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* Top Fixed Navigation Bar */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        userRole={userRole}
        onToggleRole={() => setUserRole(prev => prev === 'Admin' ? 'Analyst' : 'Admin')}
        anomaliesCount={cells.filter(c => c.status === 'anomaly').length}
        activeIncidentsCount={activeP1Count}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TelecomAI 2.0 Simulation & Operational Loop Controller */}
        <SimulationController
          onRefreshAll={handleRefreshAllData}
          onNavigateToOperations={() => handleNavigate('operations')}
        />

        {activePage === 'dashboard' && (
          <DashboardPage
            summary={summary}
            championModel={championModel}
            wilayas={SYNTHETIC_WILAYA_SIMULATION}
            customers={customers}
            cells={cells}
            trafficForecast={HOURLY_TRAFFIC_FORECAST}
            onNavigate={handleNavigate}
            onSelectCustomer={(id) => {
              setSelectedCustomerId(id);
              handleNavigate('customers');
            }}
            onSelectCell={(id) => {
              setSelectedCellId(id);
              handleNavigate('network');
            }}
          />
        )}

        {activePage === 'operations' && (
          <OperationsPage
            incidents={incidents}
            impacts={impacts}
            qosMetrics={qosMetrics}
            customers={customers}
            cells={cells}
            onUpdateIncident={handleUpdateIncident}
            onNavigate={handleNavigate}
            onSelectCell={(id) => {
              setSelectedCellId(id);
              handleNavigate('network');
            }}
            onSelectCustomer={(id) => {
              setSelectedCustomerId(id);
              handleNavigate('customers');
            }}
          />
        )}

        {activePage === 'customers' && (
          <CustomersPage
            customers={customers}
            summary={summary}
            selectedCustomerId={selectedCustomerId}
            onSelectCustomer={setSelectedCustomerId}
            onUpdateCustomer={handleUpdateCustomer}
            cells={cells}
          />
        )}

        {activePage === 'network' && (
          <NetworkPage
            cells={cells}
            selectedCellId={selectedCellId}
            onSelectCell={setSelectedCellId}
            onUpdateCell={handleUpdateCell}
          />
        )}

        {activePage === 'predictions' && (
          <PredictionsPage />
        )}

        {activePage === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Bottom Bento Telecom Status & Compliance Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 mt-auto py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sky-400 font-bold font-mono-num">
              <Radio className="w-3.5 h-3.5" />
              <span>TelecomAI</span>
            </div>
            <span className="text-slate-800">|</span>
            <span className="text-slate-400">
              AI-Powered Telecom & Customer Intelligence Platform
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono-num text-slate-400">
            <span className={`flex items-center gap-1 ${summaryError ? 'text-rose-400' : 'text-emerald-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${summaryError ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              {summaryError ? 'Backend: Unreachable' : 'Backend: Connected'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-sky-400">
              <Database className="w-3 h-3" /> Algeria Wilayas Telemetry (Synthetic)
            </span>
            <span>•</span>
            <span>
              {championModel
                ? `ROC-AUC: ${championModel.rocAuc.toFixed(2)} • Champion ${championModel.displayName || championModel.name}`
                : 'Loading model benchmark…'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}