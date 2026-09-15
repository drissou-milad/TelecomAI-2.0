import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  getHealthResponse,
  CHURN_BENCHMARK,
  ANOMALY_SPECS,
  DASHBOARD_SUMMARY,
  predictChurn,
  predictAnomaly,
} from './server/mlService';
import { analyzeNetwork } from './server/telecom2/correlationEngine';
import {
  SITES,
  CELLS,
  WILAYAS,
  getNetworkOverview,
  getCells,
  getCellById,
  getCustomers,
  getCustomerById,
  getCustomerExperience,
  getImpactSummary,
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  simulateDegradation,
  resetSimulation,
  getSimulationStatus,
  getModelPerformanceSpecs,
  getAuditEvents,
  addAuditEvent,
  simulateScenario,
  getIncidentAnalytics,
} from './server/telecom2/telecomDataStore';
import { itsmConnector } from './server/telecom2/itsmConnector';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

// 1. Health check endpoint
app.get(['/api/health', '/health'], (_req, res) => {
  res.json(getHealthResponse());
});

// 2. Churn Benchmark
app.get(['/api/churn/benchmark', '/churn/benchmark'], (_req, res) => {
  res.json(CHURN_BENCHMARK);
});

// 3. Anomaly Specs
app.get(['/api/anomaly/specs', '/anomaly/specs'], (_req, res) => {
  res.json(ANOMALY_SPECS);
});

// 4. Dashboard Headline Summary KPIs
app.get(['/api/dashboard/summary', '/dashboard/summary'], (_req, res) => {
  res.json(DASHBOARD_SUMMARY);
});

// 5. Churn Prediction Endpoint
app.post(['/api/predict/churn', '/predict/churn'], (req, res) => {
  try {
    const result = predictChurn(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: `Inference error: ${err.message}` });
  }
});

// 6. Network Anomaly Prediction Endpoint (1.0 Legacy)
app.post(['/api/predict/anomaly', '/predict/anomaly'], (req, res) => {
  try {
    const result = predictAnomaly(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: `Inference error: ${err.message}` });
  }
});

// ==========================================
// TELECOMAI 2.0 API FLOW
// ==========================================

// 7. Network Intelligence & Correlation Endpoint (TelecomAI 2.0 Core Flow)
// POST /api/network/analyze
// Ingests anomaly / network scope ➔ Runs correlation ➔ Assesses Customer & Business Impact ➔ Outputs Incident & Recommendations
app.post(['/api/network/analyze', '/network/analyze'], (req, res) => {
  try {
    const result = analyzeNetwork(req.body || {});
    res.json(result);
  } catch (err: any) {
    console.error('Error analyzing network:', err);
    res.status(500).json({ error: `Network correlation analysis error: ${err.message}` });
  }
});

// Optional GET variant for convenient browser inspection or test triggers
app.get(['/api/network/analyze', '/network/analyze'], (req, res) => {
  try {
    const wilaya = typeof req.query.wilaya === 'string' ? req.query.wilaya : 'Saida';
    const result = analyzeNetwork({ wilaya });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: `Network correlation analysis error: ${err.message}` });
  }
});

// 8. Network Topology & Hierarchy (Wilaya ➔ Site ➔ Cells)
app.get(['/api/network/topology', '/network/topology'], (_req, res) => {
  res.json({
    wilayas: WILAYAS,
    sites: SITES,
    cells: CELLS,
  });
});

// 9. Network Overview (Headline metrics, health score, regional breakdown)
app.get(['/api/network/overview', '/network/overview'], (_req, res) => {
  try {
    const overview = getNetworkOverview();
    res.json(overview);
  } catch (err: any) {
    res.status(500).json({ error: `Error fetching network overview: ${err.message}` });
  }
});

// 10. Network Cells (List with health scores, filters by wilaya/status)
app.get(['/api/network/cells', '/network/cells'], (req, res) => {
  try {
    const filters = {
      wilaya: typeof req.query.wilaya === 'string' ? req.query.wilaya : undefined,
      status: typeof req.query.status === 'string' ? req.query.status : undefined,
      siteId: typeof req.query.siteId === 'string' ? req.query.siteId : undefined,
    };
    const cells = getCells(filters);
    res.json({ cells, count: cells.length });
  } catch (err: any) {
    res.status(500).json({ error: `Error fetching cells: ${err.message}` });
  }
});

// 11. Network Cell by ID (Detailed baseline vs current telemetry, health, attached users)
app.get(['/api/network/cells/:id', '/network/cells/:id'], (req, res) => {
  try {
    const result = getCellById(req.params.id);
    if (!result) {
      return res.status(404).json({ error: `Cell ${req.params.id} not found` });
    }
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: `Error fetching cell details: ${err.message}` });
  }
});

// 12. Customer Experience Intelligence (List with CXS, churn probability, network exposure)
app.get(['/api/customers', '/customers'], (req, res) => {
  try {
    const filters = {
      wilaya: typeof req.query.wilaya === 'string' ? req.query.wilaya : undefined,
      cellId: typeof req.query.cellId === 'string' ? req.query.cellId : undefined,
      highRisk: req.query.highRisk === 'true' ? true : req.query.highRisk === 'false' ? false : undefined,
    };
    const customers = getCustomers(filters);
    res.json({ customers, count: customers.length });
  } catch (err: any) {
    res.status(500).json({ error: `Error fetching customers: ${err.message}` });
  }
});

// 13. Customer Details by ID
app.get(['/api/customers/:id', '/customers/:id'], (req, res) => {
  try {
    const result = getCustomerById(req.params.id);
    if (!result) {
      return res.status(404).json({ error: `Customer ${req.params.id} not found` });
    }
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: `Error fetching customer profile: ${err.message}` });
  }
});

// 14. Customer Experience Breakdown & SHAP Attribution
app.get(['/api/customers/:id/experience', '/customers/:id/experience'], (req, res) => {
  try {
    const result = getCustomerExperience(req.params.id);
    if (!result) {
      return res.status(404).json({ error: `Customer ${req.params.id} not found` });
    }
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: `Error fetching experience score: ${err.message}` });
  }
});

// 15. Business Impact Summary
app.get(['/api/impact/summary', '/impact/summary'], (_req, res) => {
  try {
    const summary = getImpactSummary();
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ error: `Error fetching impact summary: ${err.message}` });
  }
});

// 16. Incident Intelligence: List Incidents
app.get(['/api/incidents', '/incidents'], (_req, res) => {
  try {
    const incidents = getIncidents();
    res.json({ incidents, count: incidents.length });
  } catch (err: any) {
    res.status(500).json({ error: `Error fetching incidents: ${err.message}` });
  }
});

// 17. Incident Intelligence: Get Incident by ID
app.get(['/api/incidents/:id', '/incidents/:id'], (req, res) => {
  try {
    const incident = getIncidentById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: `Incident ${req.params.id} not found` });
    }
    res.json(incident);
  } catch (err: any) {
    res.status(500).json({ error: `Error fetching incident: ${err.message}` });
  }
});

// 18. Incident Intelligence: Create / Ingest Incident
app.post(['/api/incidents', '/incidents'], (req, res) => {
  try {
    const newInc = createIncident(req.body);
    res.status(201).json(newInc);
  } catch (err: any) {
    res.status(500).json({ error: `Error creating incident: ${err.message}` });
  }
});

// 19. Incident Intelligence: Update Incident Status
app.patch(['/api/incidents/:id', '/incidents/:id'], (req, res) => {
  try {
    const updated = updateIncident(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: `Incident ${req.params.id} not found` });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: `Error updating incident: ${err.message}` });
  }
});

// 20. Dedicated AI Operations Analysis for Incident
app.get(['/api/ai/incidents/:id/analysis', '/ai/incidents/:id/analysis'], (req, res) => {
  try {
    const incident = getIncidentById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: `Incident ${req.params.id} not found` });
    }

    const aiAnalysis = {
      incident_id: incident.incident_id,
      title: incident.title,
      confidence: incident.ai_analysis.confidence,
      questions: {
        what_happened: `A severe cellular performance anomaly occurred in Wilaya ${incident.infrastructure.wilaya}, affecting ${incident.infrastructure.cells} radio cells across ${incident.infrastructure.sites} base stations. Backhaul transport latency spiked by ${incident.network_impact.latency_increase_pct}% over baseline, with a ${incident.network_impact.packet_loss_increase_pct}% surge in packet loss.`,
        why_is_it_important: `The physical anomaly directly impacts ${incident.customer_impact.affected_customers.toLocaleString()} connected subscribers, including ${incident.customer_impact.high_risk_customers} high-risk accounts with repeat complaints. The financial exposure totals ${incident.business_impact.revenue_at_risk.toLocaleString()} DZD in monthly recurring revenue at risk.`,
        who_is_affected: `Primary impact on subscribers connected to sectors ${incident.infrastructure.cellIds.join(', ')}. Includes critical Enterprise B2B accounts (e.g. Healthcare clinics, logistics fleet) and VIP priority subscribers.`,
        what_evidence_supports_this: incident.evidence ? incident.evidence.root_cause_indicators : [
          `Latency delta: ${incident.network_impact.latency_increase_pct}% vs baseline`,
          `Packet loss delta: ${incident.network_impact.packet_loss_increase_pct}% vs baseline`,
        ],
        what_should_operations_investigate_next: incident.ai_analysis.recommended_action,
      },
      recommended_action: incident.ai_analysis.recommended_action,
      confidence_factors: [
        { factor: 'RAN Telemetry Deviation Significance', score: 0.92 },
        { factor: 'Subscriber Spatial Attachment Match', score: 0.88 },
        { factor: 'Historical Backhaul Link Pattern Match', score: 0.81 },
        { factor: 'Cross-Cell Anomaly Correlation', score: 0.86 },
      ],
      synthetic_disclaimer: 'Synthetic telecom environment — illustrative data, not real operator statistics.',
    };

    res.json(aiAnalysis);
  } catch (err: any) {
    res.status(500).json({ error: `Error generating AI operations analysis: ${err.message}` });
  }
});

// 21. ITSM Integration: Create / Dispatch Ticket
app.post(['/api/integrations/itsm/ticket', '/integrations/itsm/ticket'], async (req, res) => {
  try {
    const ticket = await itsmConnector.createTicket(req.body);
    // Update the incident with the ticket reference if incident_id is passed
    if (req.body.incident_id) {
      updateIncident(req.body.incident_id, {
        status: 'DISPATCHED',
        itsm_ticket: {
          ticket_id: ticket.ticket_id,
          system: ticket.system,
          dispatched_at: ticket.created_at,
          status: ticket.status,
        },
      });
    }
    res.status(201).json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: `ITSM dispatch error: ${err.message}` });
  }
});

// 22. ITSM Integration: Get Ticket by ID
app.get(['/api/integrations/itsm/ticket/:id', '/integrations/itsm/ticket/:id'], async (req, res) => {
  try {
    const ticket = await itsmConnector.getTicket(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: `ITSM Ticket ${req.params.id} not found` });
    }
    res.json(ticket);
  } catch (err: any) {
    res.status(500).json({ error: `Error retrieving ITSM ticket: ${err.message}` });
  }
});

// 23. ITSM Integration: List All Dispatched Tickets
app.get(['/api/integrations/itsm/tickets', '/integrations/itsm/tickets'], async (_req, res) => {
  try {
    const tickets = await itsmConnector.listTickets();
    res.json({ tickets, count: tickets.length });
  } catch (err: any) {
    res.status(500).json({ error: `Error retrieving ITSM tickets: ${err.message}` });
  }
});

// 24. Model Performance Specs (Preserves TelecomAI 1.0 real documented models)
app.get(['/api/models/performance', '/models/performance'], (_req, res) => {
  try {
    const specs = getModelPerformanceSpecs();
    res.json(specs);
  } catch (err: any) {
    res.status(500).json({ error: `Error retrieving model performance: ${err.message}` });
  }
});

// 25. Controlled Demonstration Simulation Endpoints
app.post(['/api/simulation/degrade', '/simulation/degrade'], (req, res) => {
  try {
    const wilaya = req.body.wilaya || 'Saida';
    const result = simulateDegradation(wilaya);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: `Simulation error: ${err.message}` });
  }
});

app.post(['/api/simulation/reset', '/simulation/reset'], (_req, res) => {
  try {
    const result = resetSimulation();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: `Simulation reset error: ${err.message}` });
  }
});

app.get(['/api/simulation/status', '/simulation/status'], (_req, res) => {
  try {
    const status = getSimulationStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: `Simulation status error: ${err.message}` });
  }
});

// 26. Multi-Scenario Simulation Engine
app.post(['/api/simulation/scenario', '/simulation/scenario'], (req, res) => {
  try {
    const result = simulateScenario(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: `Scenario simulation error: ${err.message}` });
  }
});

// 27. Real-Time Operations Event / Audit Stream
app.get(['/api/events', '/events'], (req, res) => {
  try {
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 50;
    const filterType = typeof req.query.type === 'string' ? req.query.type : undefined;
    const events = getAuditEvents(limit, filterType);
    res.json({ events, count: events.length });
  } catch (err: any) {
    res.status(500).json({ error: `Error fetching audit events: ${err.message}` });
  }
});

// 28. Historical Incident Analytics (MTTR, distribution, recurring causes)
app.get(['/api/incidents/analytics', '/incidents/analytics'], (_req, res) => {
  try {
    const analytics = getIncidentAnalytics();
    res.json(analytics);
  } catch (err: any) {
    res.status(500).json({ error: `Error fetching incident analytics: ${err.message}` });
  }
});


// Vite middleware setup for serving the React frontend
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Telecom AI Platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

