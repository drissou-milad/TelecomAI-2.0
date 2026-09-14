# TelecomAI 2.0 — ITSM Integration Architecture & Methodology

## 1. Overview & Scope Boundaries

> **Important Boundary Notice**: TelecomAI 2.0 is an operational and customer experience **intelligence layer**, not a replacement for enterprise Service Management platforms.
>
> It does not attempt to replicate full ticket lifecycle management, CMDB reconciliation, or service desk queues. Instead, it computes high-fidelity incident intelligence, quantifies customer blast radius, formulates engineering playbooks, and injects actionable tickets into external ITSM systems.

---

## 2. Integration Architecture

```
┌────────────────────────────────────────────────────────┐
│             TelecomAI 2.0 Incident Engine             │
│   (Anomaly Detection + Correlation + Blast Radius)    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   ITSM Connector Layer                 │
│         (Interface Abstraction: ITSMConnector)         │
├───────────────────────────┬────────────────────────────┤
│ • Ticket payload builder  │ • Priority mapping (P1-P4) │
│ • Idempotent dispatch     │ • Bidirectional sync hook  │
└─────────────┬─────────────┴──────────────┬─────────────┘
              │                            │
              ▼                            ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│   Mock / Prototype ITSM   │ │  Enterprise Connectors   │
│   - In-memory dispatch    │ │  - ServiceNow Table API  │
│   - Ticket lifecycle test │ │  - Jira Service Desk     │
│   - Immediate audit log   │ │  - Webhook Dispatcher    │
└───────────────────────────┘ └──────────────────────────┘
```

---

## 3. ITSM Connector Interface Specification

The core abstraction is defined in `server/telecom2/itsmConnector.ts`:

```typescript
export interface ITSMTicketRequest {
  incident_id: string;
  title: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  affected_infrastructure: {
    wilaya: string;
    sites: number;
    cells: number;
    cell_ids: string[];
    site_ids: string[];
  };
  customer_impact: {
    affected_customers: number;
    high_risk_customers: number;
  };
  business_impact: {
    impact_score: number;
    revenue_at_risk_dzd: number;
  };
  ai_assessment: string;
  recommended_action: string;
  confidence: number;
  system?: 'ServiceNow' | 'Jira Service Management' | 'BMC Remedy';
}

export interface ITSMTicket {
  ticket_id: string;
  incident_id: string;
  external_url: string;
  system: 'ServiceNow' | 'Jira Service Management' | 'BMC Remedy';
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NEW' | 'ASSIGNED' | 'WORK_IN_PROGRESS' | 'RESOLVED';
  assigned_group: string;
  created_at: string;
  updated_at: string;
  summary: string;
  work_notes: string[];
}

export interface ITSMConnector {
  createTicket(req: ITSMTicketRequest): Promise<ITSMTicket>;
  getTicket(ticketId: string): Promise<ITSMTicket | null>;
  updateTicket(ticketId: string, update: Partial<ITSMTicket>): Promise<ITSMTicket>;
  listTickets(): Promise<ITSMTicket[]>;
}
```

---

## 4. Priority & Urgency Mapping

TelecomAI dynamically assigns operational priority based on customer exposure and revenue at risk:

| TelecomAI Priority | ServiceNow Urgency / Impact | Jira Severity | Operational SLA Target |
|:---:|:---:|:---:|:---:|
| **P1** | Urgency 1 / Impact 1 | Highest / Blocker | 30 minutes (NOC immediate dispatch) |
| **P2** | Urgency 2 / Impact 1 | High / Critical | 2 hours (RAN tier-2 intervention) |
| **P3** | Urgency 2 / Impact 2 | Medium / Major | 8 hours (Regional maintenance) |
| **P4** | Urgency 3 / Impact 3 | Low / Minor | 24 hours (Scheduled inspection) |

---

## 5. Prototype & Mock ITSM Provider

For the MVP environment, an in-memory `PrototypeITSMConnector` is provided:
- Generates realistic external ticket identifiers (e.g. `INC-SNOW-89421` or `JIRA-NOC-4412`).
- Stores dispatch history and audit timestamps.
- Returns deep-link simulation URLs.
- Clearly labeled in the UI: **"Prototype ITSM integration — illustrative operational dispatch"**.

---

## 6. Real Enterprise Adaptability (Future Scope)
When transitioning to production operator deployments:
- Configure OAuth2 / Basic Auth credentials for ServiceNow instance (`https://instance.service-now.com/api/now/table/incident`).
- Webhook subscriptions (`incident.state_changed`) to auto-sync resolution status back into TelecomAI.
