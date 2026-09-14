/**
 * TelecomAI 2.0 — ITSM Connector Module
 * Implements the ITSM connector abstraction and prototype in-memory provider
 * for enterprise ticketing systems (ServiceNow, Jira Service Management, BMC Remedy).
 */

import { ITSMTicket, ITSMTicketRequest, IncidentPriority, IncidentSeverity } from './types';

export interface ITSMConnector {
  createTicket(req: ITSMTicketRequest): Promise<ITSMTicket>;
  getTicket(ticketId: string): Promise<ITSMTicket | null>;
  updateTicket(ticketId: string, updates: Partial<ITSMTicket>): Promise<ITSMTicket>;
  listTickets(): Promise<ITSMTicket[]>;
}

// In-memory store for prototype ITSM tickets
const TICKETS_DB: Map<string, ITSMTicket> = new Map();

// Seed initial ticket for demo continuity
const INITIAL_TICKET: ITSMTicket = {
  ticket_id: 'INC-SNOW-89421',
  incident_id: 'INC-0001',
  external_url: 'https://prototype-itsm.telecomai.internal/nav_to.do?uri=incident.do?sys_id=INC-SNOW-89421',
  system: 'ServiceNow',
  priority: 'P1',
  severity: 'HIGH',
  status: 'ASSIGNED',
  assigned_group: 'NOC-Transport-Tier2',
  created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 1800 * 1000).toISOString(),
  summary: '[P1-CRITICAL] Microwave Link Degradation - Saïda Central Footprint (1,284 subs, 12,500 DZD at risk)',
  work_notes: [
    'System auto-dispatched ticket via TelecomAI 2.0 Correlation Engine.',
    'Assigned to NOC-Transport-Tier2 queue. SLA countdown: 30 minutes.',
    'Automated AI assessment injected with 84% confidence.',
  ],
};

TICKETS_DB.set(INITIAL_TICKET.ticket_id, INITIAL_TICKET);
TICKETS_DB.set(INITIAL_TICKET.incident_id, INITIAL_TICKET); // Secondary lookup by incident_id

export class PrototypeITSMConnector implements ITSMConnector {
  async createTicket(req: ITSMTicketRequest): Promise<ITSMTicket> {
    const system = req.system || 'ServiceNow';
    const prefix = system === 'ServiceNow' ? 'INC-SNOW' : system === 'Jira Service Management' ? 'JIRA-NOC' : 'BMC-INC';
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const ticketId = `${prefix}-${randomNum}`;
    const now = new Date().toISOString();

    const summary = `[${req.priority}-${req.severity}] ${req.title} (${req.customer_impact.affected_customers.toLocaleString()} subs, ${req.business_impact.revenue_at_risk_dzd.toLocaleString()} DZD exposure)`;

    const assignedGroup = req.priority === 'P1' ? 'NOC-Emergency-Tier1' : req.priority === 'P2' ? 'RAN-Optimization-Tier2' : 'Regional-Field-Tech';

    const ticket: ITSMTicket = {
      ticket_id: ticketId,
      incident_id: req.incident_id,
      external_url: `https://prototype-itsm.telecomai.internal/tickets/${ticketId}`,
      system,
      priority: req.priority,
      severity: req.severity,
      status: 'ASSIGNED',
      assigned_group: assignedGroup,
      created_at: now,
      updated_at: now,
      summary,
      work_notes: [
        `Dispatched automatically by TelecomAI 2.0 operational loop.`,
        `AI Operations Assessment: ${req.ai_assessment}`,
        `Recommended Playbook: ${req.recommended_action} (Confidence: ${(req.confidence * 100).toFixed(0)}%)`,
        `Infrastructure scope: Wilaya ${req.affected_infrastructure.wilaya}, ${req.affected_infrastructure.sites} sites, ${req.affected_infrastructure.cells} cells.`,
        `High-risk subscribers: ${req.customer_impact.high_risk_customers} | Est. revenue exposure: ${req.business_impact.revenue_at_risk_dzd.toLocaleString()} DZD.`,
      ],
    };

    TICKETS_DB.set(ticketId, ticket);
    TICKETS_DB.set(req.incident_id, ticket);

    return ticket;
  }

  async getTicket(ticketIdOrIncidentId: string): Promise<ITSMTicket | null> {
    return TICKETS_DB.get(ticketIdOrIncidentId) || null;
  }

  async updateTicket(ticketId: string, updates: Partial<ITSMTicket>): Promise<ITSMTicket> {
    const existing = TICKETS_DB.get(ticketId);
    if (!existing) {
      throw new Error(`Ticket ${ticketId} not found in ITSM registry`);
    }

    const updated: ITSMTicket = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
      work_notes: updates.work_notes ? [...existing.work_notes, ...updates.work_notes] : existing.work_notes,
    };

    TICKETS_DB.set(ticketId, updated);
    TICKETS_DB.set(updated.incident_id, updated);
    return updated;
  }

  async listTickets(): Promise<ITSMTicket[]> {
    // Return unique tickets
    const unique = new Map<string, ITSMTicket>();
    for (const ticket of TICKETS_DB.values()) {
      unique.set(ticket.ticket_id, ticket);
    }
    return Array.from(unique.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
}

export const itsmConnector = new PrototypeITSMConnector();
