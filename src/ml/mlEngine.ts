/**
 * Frontend API Adapter for Telecom ML Suite
 * Bridges the UI to the server inference endpoints (/api/predict/*, /api/churn/*, /api/anomaly/*).
 *
 * There is no client-side model logic here: predictions and benchmark/spec metrics
 * are served directly by the backend API.
 *
 * Connected Models:
 * - Customer Churn: Multi-Model Benchmark (Champion: Gradient Boosting selected via validation ROC-AUC / F1)
 * - Network Anomaly: Unsupervised Isolation Forest
 * - Explainability: SHAP (SHapley Additive exPlanations) Attributions
 */

import {
  RiskLevel,
  CellStatus,
  RiskFactor,
  ModelComparison,
  FeatureImportance,
  DashboardSummary
} from '../types';

export interface ChurnPredictionInput {
  monthlySpendDZD: number;
  dataUsageGB: number;
  callsCount: number;
  complaints: number;
  rechargeFrequency: number;
  subscription: 'Prepaid' | 'Postpaid';
  tenureMonths: number;
  usageDropPct?: number;
}

export interface ChurnPredictionResult {
  churnProbability: number; // 0 - 100
  riskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  recommendedAction: string;
  retentionImpactEstimate: string;
}

export interface AnomalyPredictionInput {
  cellId: string;
  users: number;
  latencyMs: number;
  packetLossPct: number;
  trafficMbps: number;
  availabilityPct: number;
}

export interface AnomalyPredictionResult {
  status: CellStatus;
  anomalyScore: number; // -1 to 1 (Isolation Forest decision function: negative indicates outlier)
  confidencePct: number;
  possibleCauses: string[];
  aiIncidentSummary: string;
  recommendedResolution: string;
}

export type ApiStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error' | 'timeout' | 'invalid_response';

export interface ApiState<T> {
  status: ApiStatus;
  data: T | null;
  error: string | null;
}

export class ApiTimeoutError extends Error {
  constructor(message = 'API request timed out after 8000ms') {
    super(message);
    this.name = 'ApiTimeoutError';
  }
}

export class ApiInvalidResponseError extends Error {
  constructor(message = 'Invalid response received from server') {
    super(message);
    this.name = 'ApiInvalidResponseError';
  }
}

async function fetchJson<T>(url: string, options?: RequestInit, timeoutMs = 8000): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.status === 204) {
      return null as unknown as T;
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errData.error || errData.detail || `Server error: HTTP ${response.status}`);
    }

    const text = await response.text();
    if (!text || text.trim().length === 0) {
      return null as unknown as T;
    }

    try {
      const data = JSON.parse(text);
      if (data === null || data === undefined) {
        throw new ApiInvalidResponseError('Empty response payload');
      }
      return data as T;
    } catch (parseErr: any) {
      if (parseErr instanceof ApiInvalidResponseError) throw parseErr;
      throw new ApiInvalidResponseError(`Invalid JSON payload: ${parseErr.message}`);
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiTimeoutError(`API request to ${url} timed out after ${timeoutMs}ms`);
    }
    throw err;
  }
}

/**
 * Executes real-time churn inference via the backend.
 * Calls the ML inference service and returns SHAP feature attributions.
 * Throws if the backend is unreachable.
 */
export async function predictCustomerChurnApi(input: ChurnPredictionInput): Promise<ChurnPredictionResult> {
  return fetchJson<ChurnPredictionResult>('/api/predict/churn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
}

/**
 * Executes real-time anomaly inference via the backend.
 * Evaluates multi-metric deviations against statistical baselines.
 * Throws if the backend is unreachable.
 */
export async function predictNetworkAnomalyApi(input: AnomalyPredictionInput): Promise<AnomalyPredictionResult> {
  return fetchJson<AnomalyPredictionResult>('/api/predict/anomaly', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
}

/**
 * Multi-Model Benchmark Results, fetched from the backend evaluation endpoint.
 */
export async function getChurnBenchmark(): Promise<{ models: ModelComparison[]; featureImportances: FeatureImportance[] }> {
  const data = await fetchJson<any>('/api/churn/benchmark');
  return {
    models: data.models,
    featureImportances: data.featureImportances
  };
}

/**
 * Isolation Forest specs and evaluation metrics, fetched from the backend.
 */
export async function getAnomalySpecs(): Promise<{
  modelName: string;
  contamination: number;
  nEstimators: number;
  maxSamples: string;
  metricsMonitored: string[];
  totalCellsMonitored: number;
  anomaliesDetected: number;
  normalCells: number;
  rocAucEstimate: number;
}> {
  return fetchJson('/api/anomaly/specs');
}

/**
 * Headline platform KPIs, computed on the backend by scoring synthetic subscriber
 * records and aggregating cell telemetry.
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  return fetchJson<DashboardSummary>('/api/dashboard/summary');
}
