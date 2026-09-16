/**
 * TelecomAI 2.0 Automated Verification Suite
 * Tests the complete Operational Intelligence Loop:
 * Telemetry ➔ Detection ➔ Correlation ➔ Customer Impact ➔ Business Impact ➔
 * Incident ➔ Priority ➔ AI Assessment ➔ Recommended Action ➔ ITSM Connector ➔ Simulation
 */

import { analyzeNetwork } from './correlationEngine';
import {
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
  calculateCellHealthScore,
  calculateCustomerExperienceIndex,
  getModelPerformanceSpecs,
  CELLS,
} from './telecomDataStore';
import { itsmConnector } from './itsmConnector';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

async function runVerificationSuite() {
  console.log('\n==================================================');
  console.log('TELECOMAI 2.0 OPERATIONAL INTELLIGENCE TEST SUITE');
  console.log('==================================================\n');

  // 1. Health Calculation Test
  console.log('--- Test 1: Cell Health Score Calculation ---');
  const normalCell = CELLS.find(c => c.status === 'normal');
  assert(!!normalCell, 'Normal cell exists in datastore');
  const normalHealth = calculateCellHealthScore(normalCell!);
  assert(normalHealth >= 90, `Normal cell health is high (${normalHealth}/100)`);

  const anomalyCell = CELLS.find(c => c.status === 'anomaly');
  assert(!!anomalyCell, 'Anomalous cell exists in datastore');
  const anomalyHealth = calculateCellHealthScore(anomalyCell!);
  assert(anomalyHealth < normalHealth, `Anomalous cell health (${anomalyHealth}) is lower than normal (${normalHealth})`);

  // 2. Correlation Engine Full Loop (Saïda footprint)
  console.log('\n--- Test 2: AI Correlation Engine Loop ---');
  const analysis = analyzeNetwork({ wilaya: 'Saida' });
  assert(analysis.infrastructure.wilaya === 'Saida', 'Correct target wilaya analyzed');
  assert(analysis.infrastructure.sites === 3, 'Identified 3 sites in Saïda footprint');
  assert(analysis.infrastructure.cells === 7, 'Identified 7 cells in Saïda footprint');
  assert(analysis.network_impact.latency_increase_pct === 38, 'Calculated +38% latency increase');
  assert(analysis.network_impact.packet_loss_increase_pct === 12, 'Calculated +12% packet loss increase');
  assert(analysis.customer_impact.affected_customers === 1284, 'Calculated 1,284 affected customers');
  assert(analysis.customer_impact.high_risk_customers === 237, 'Calculated 237 high-risk customers');
  assert(analysis.business_impact.impact_score === 87, 'Calculated impact score of 87');
  assert(analysis.business_impact.revenue_at_risk === 12500, 'Calculated 12,500 DZD revenue at risk');
  assert(analysis.severity === 'HIGH', 'Severity classified as HIGH');
  assert(analysis.priority === 'P1', 'Operational priority classified as P1');
  assert(analysis.ai_analysis.confidence >= 0.80, `AI confidence score is robust (${analysis.ai_analysis.confidence})`);
  assert(analysis.ai_analysis.recommended_action.includes('failover'), 'Playbook includes failover recommendation');

  // 3. Customer Experience & SHAP Attribution
  console.log('\n--- Test 3: Customer Experience Index & SHAP Attribution ---');
  const custDetail = getCustomerById('CUST-SAI-001');
  assert(!!custDetail, 'Customer CUST-SAI-001 found');
  assert(custDetail!.experience.score < 70, `Exposed customer has degraded CXS (${custDetail!.experience.score})`);
  assert(custDetail!.customer.isHighRisk === true, 'Flagged as high-risk subscriber');
  assert(custDetail!.experience.riskFactors.length > 0, 'Risk factors accurately identified');
  assert(typeof custDetail!.experience.shapAttribution['Network Degradation'] === 'number', 'SHAP attribution factors populated');

  // 4. Incident Intelligence & Lifecycle Management
  console.log('\n--- Test 4: Incident Intelligence & Lifecycle ---');
  const incidents = getIncidents();
  assert(incidents.length >= 2, `Incidents list loaded (${incidents.length} incidents)`);
  const inc0001 = getIncidentById('INC-0001');
  assert(!!inc0001, 'Canonical incident INC-0001 found');
  assert(inc0001!.priority === 'P1', 'Incident priority is P1');

  // Create new incident
  const created = createIncident({
    title: 'Test Microwave Flapping Event',
    severity: 'MEDIUM',
    priority: 'P2',
  });
  assert(created.incident_id.startsWith('INC-'), 'New incident created with formatted ID');
  const updated = updateIncident(created.incident_id, { status: 'INVESTIGATING' });
  assert(updated?.status === 'INVESTIGATING', 'Incident status updated to INVESTIGATING');

  // 5. ITSM Integration & Ticket Dispatch
  console.log('\n--- Test 5: ITSM Ticket Connector ---');
  const itsmTicket = await itsmConnector.createTicket({
    incident_id: inc0001!.incident_id,
    title: inc0001!.title,
    priority: inc0001!.priority,
    severity: inc0001!.severity,
    affected_infrastructure: {
      wilaya: inc0001!.infrastructure.wilaya,
      sites: inc0001!.infrastructure.sites,
      cells: inc0001!.infrastructure.cells,
      cell_ids: inc0001!.infrastructure.cellIds,
      site_ids: inc0001!.infrastructure.siteIds,
    },
    customer_impact: inc0001!.customer_impact,
    business_impact: {
      impact_score: inc0001!.business_impact.impact_score,
      revenue_at_risk_dzd: inc0001!.business_impact.revenue_at_risk,
    },
    ai_assessment: inc0001!.ai_analysis.assessment,
    recommended_action: inc0001!.ai_analysis.recommended_action,
    confidence: inc0001!.ai_analysis.confidence,
    system: 'ServiceNow',
  });

  assert(itsmTicket.ticket_id.startsWith('INC-SNOW-'), `ServiceNow ticket created (${itsmTicket.ticket_id})`);
  assert(itsmTicket.status === 'ASSIGNED', 'Ticket state is ASSIGNED');
  assert(itsmTicket.work_notes.length >= 3, 'Work notes populated with AI operational evidence');

  const retrievedTicket = await itsmConnector.getTicket(itsmTicket.ticket_id);
  assert(retrievedTicket?.ticket_id === itsmTicket.ticket_id, 'Successfully retrieved ticket from ITSM registry');

  // 6. Simulation Engine (Degrade & Restore)
  console.log('\n--- Test 6: Simulation Engine Controls ---');
  const simDegrade = simulateDegradation('Saida');
  assert(simDegrade.simulation.isActive === true, 'Simulation active state confirmed');
  const overviewDegraded = getNetworkOverview();
  assert(overviewDegraded.detected_anomalies >= 7, `Detected anomalies present during simulation (${overviewDegraded.detected_anomalies})`);

  const simReset = resetSimulation();
  assert(simReset.simulation.isActive === false, 'Simulation reset confirmed');
  const overviewReset = getNetworkOverview();
  assert(overviewReset.detected_anomalies === 0, `All cells nominal after reset (${overviewReset.detected_anomalies} anomalies)`);

  // Restore active simulation for demo
  simulateDegradation('Saida');

  // 7. Full End-to-End Operational Intelligence Loop (Requirement 16)
  console.log('\n--- Test 7: Complete End-to-End Intelligence Loop ---');
  // Step 1: Simulate cell degradation
  const sim = simulateDegradation('Saida');
  assert(sim.simulation.isActive === true, 'Step 1: Cell degradation successfully induced on Saida footprint');

  // Step 2: Verify anomaly detected
  const postDegradeOverview = getNetworkOverview();
  assert(postDegradeOverview.detected_anomalies > 0, `Step 2: Anomaly detected (${postDegradeOverview.detected_anomalies} degraded cells)`);

  // Step 3: Verify incident created / correlated
  const loopAnalysis = analyzeNetwork({ wilaya: 'Saida' });
  assert(loopAnalysis.infrastructure.cells > 0, 'Step 3: Network correlation mapped cells to canonical incident');

  // Step 4: Verify customer impact calculated
  assert(loopAnalysis.customer_impact.affected_customers > 0, `Step 4: Customer blast radius computed (${loopAnalysis.customer_impact.affected_customers} users)`);
  assert(loopAnalysis.business_impact.revenue_at_risk > 0, `Step 4b: Business revenue risk calculated (${loopAnalysis.business_impact.revenue_at_risk} DZD)`);

  // Step 5: Verify priority assigned
  assert(loopAnalysis.priority === 'P1' || loopAnalysis.priority === 'P2', `Step 5: Operational priority dynamically assigned (${loopAnalysis.priority})`);

  // Step 6: Verify recommended action produced
  assert(loopAnalysis.ai_analysis.recommended_action.length > 10, `Step 6: AI operational recommendation produced ("${loopAnalysis.ai_analysis.recommended_action.slice(0, 40)}...")`);

  // Step 7: Verify ITSM ticket generated
  const e2eTicket = await itsmConnector.createTicket({
    incident_id: 'INC-E2E-LOOP',
    title: 'Automated E2E Verification Incident',
    priority: loopAnalysis.priority,
    severity: loopAnalysis.severity,
    affected_infrastructure: {
      wilaya: loopAnalysis.infrastructure.wilaya,
      sites: loopAnalysis.infrastructure.sites,
      cells: loopAnalysis.infrastructure.cells,
      cell_ids: ['CELL-SAI-001', 'CELL-SAI-002'],
      site_ids: ['SITE-SAI-001'],
    },
    customer_impact: loopAnalysis.customer_impact,
    business_impact: {
      impact_score: loopAnalysis.business_impact.impact_score,
      revenue_at_risk_dzd: loopAnalysis.business_impact.revenue_at_risk,
    },
    ai_assessment: loopAnalysis.ai_analysis.assessment,
    recommended_action: loopAnalysis.ai_analysis.recommended_action,
    confidence: loopAnalysis.ai_analysis.confidence,
    system: 'ServiceNow',
  });
  assert(e2eTicket.ticket_id.startsWith('INC-SNOW-'), `Step 7: ITSM ticket dispatched to enterprise queue (${e2eTicket.ticket_id})`);

  // 8. Model Performance Documentation
  console.log('\n--- Test 8: ML Model Performance Retention ---');
  const modelSpecs = getModelPerformanceSpecs();
  assert(modelSpecs.models.length === 2, 'Retained both Churn Champion and RAN Anomaly models');
  const champion = modelSpecs.models.find(m => m.isChampion);
  assert(champion?.metrics.rocAuc === 0.961, 'Gradient Boosting retains documented 0.961 ROC-AUC');

  console.log('\n==================================================');
  console.log('ALL TELECOMAI 2.0 VERIFICATION SUITES PASSED! 🎉');
  console.log('==================================================\n');
}

runVerificationSuite().catch(err => {
  console.error('Test run error:', err);
  process.exit(1);
});
