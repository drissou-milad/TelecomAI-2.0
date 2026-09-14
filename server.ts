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
import { SITES, CELLS, WILAYAS } from './server/telecom2/telecomDataStore';

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

