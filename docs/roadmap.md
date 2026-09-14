# TelecomAI 2.0 — Product Engineering Roadmap

This roadmap documents the staged transition from TelecomAI 1.0 (Proof-of-concept ML) to TelecomAI 2.0 (Autonomous Telecom Operations & Incident Intelligence).

---

## Phase A — Foundation (Milestone 1)
- [x] **1. Data Model Specification**: Define typed contracts for Network, Customer, Incident, and Integration domains (`docs/data-model.md`).
- [x] **2. Mathematical Framework**: Formalize traceable formulas for Customer Impact, Business Impact, and Revenue at Risk (`docs/impact-model.md`).
- [x] **3. Incident & Operational Logic**: Document severity tiers, dynamic P1-P4 priority calculations, and evidence schema (`docs/incident-model.md`).
- [x] **4. Synthetic Telecom Environment**: Establish multi-tier Algerian network topology (Wilaya ➔ Site ➔ Cell Sector) and real customer mappings.
- [ ] **5. Core API Contract**: Implement `POST /api/network/analyze` end-to-end flow with verifiable origin calculations.

---

## Phase B — Intelligence
- [ ] **6. Network Health & Baselines**: Compute rolling deviations for Latency, Packet Loss, Throughput, and PRB load.
- [ ] **7. Multi-Metric Anomaly Detection**: Unsupervised outlier detection identifying degraded sector clusters.
- [ ] **8. Customer Experience Index (CEI)**: 4-pillar SQM scoring (Network QoE, Service & Care, Usage, Tenure).
- [ ] **9. Network ➔ Customer Correlation Engine**: Map degraded RAN carrier sectors directly to attached and fallback subscribers.
- [ ] **10. Business Impact Formulation**: Calculate real-time blast radius, vulnerable subscriber count, and DZD revenue exposure.

---

## Phase C — Operations
- [ ] **11. Incident Generation Engine**: Deduplicate cell alarms into canonical incidents with spatial/topological awareness.
- [ ] **12. Deterministic Incident Prioritization**: Calculate dynamic P1–P4 urgency with SLA countdown tracking.
- [ ] **13. AI Assessment & Diagnostic Synthesis**: Generate plain-English root cause summaries with confidence metrics.
- [ ] **14. Dual-Track Recommended Actions**: Produce technical RAN remediation steps alongside proactive retention playbooks.
- [ ] **15. Incident Timeline**: Track state transitions (`NEW` ➔ `INVESTIGATING` ➔ `DISPATCHED` ➔ `RESOLVED`).

---

## Phase D — Integration
- [ ] **16. ITSM Abstraction Layer**: Interface definition for ticketing and operations systems.
- [ ] **17. REST Connector**: ServiceNow Table API payload transformation.
- [ ] **18. Webhook Engine**: Event dispatch for external automation runbooks.
- [ ] **19. Mock ITSM Sandbox**: Built-in interactive simulator verifying bi-directional dispatch and external ticket IDs.
- [ ] **20. One-Click Ticket Dispatch**: Complete frontend-to-backend ticketing action.

---

## Phase E — Product UI
- [ ] **21. Executive Overview Console**: Live pulse of national network status, active P1 incidents, and revenue at risk.
- [ ] **22. Network Intelligence View**: Interactive RAN topology explorer (Wilaya ➔ Site ➔ Sector) with live telemetry curves.
- [ ] **23. Customer Experience Console**: Subscriber risk profiles, CEI score breakdown, and serving sector linkages.
- [ ] **24. Incidents & Operations Command**: Incident triage board with SLA timers, impact blast analysis, and live ITSM dispatch.
- [ ] **25. AI Analysis Lab**: Deep dive into causal graphs, SHAP explanations, and confidence metrics.
- [ ] **26. Model Performance & Benchmarks**: Validation metrics, confusion matrices, and ROC curves across algorithms.

---

## Phase F — Quality & Production
- [ ] **27. TypeScript Compile & Lint Validation**: Strict typing across frontend and backend services.
- [ ] **28. API Response Validation**: Schema compliance for `POST /api/network/analyze`.
- [ ] **29. Graceful Error Handling**: Resilient fallbacks for edge-case network inputs.
- [ ] **30. Production Build Optimization**: Single self-contained bundle via esbuild and Vite.
