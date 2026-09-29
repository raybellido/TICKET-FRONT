export type TicketStatus =
| "OPEN"
| "IN_PROGRESS"
| "RESOLVED"
| "CLOSED"

export type TicketPriority =
| "LOW"
| "MEDIUM"
| "HIGH"
| "CRITICAL"

// Este type lo devuelve GET /api/tickets (la lista).
// OJO: no tiene description. El backend NO manda la descripcion en la lista,
// solo en el detalle. Por eso TicketsPage no puede pintar la descripcion.
export interface TicketSummary {
id: number
title: string
status: TicketStatus
priority: TicketPriority
userId: number
createdAt: string
}

// Este type lo devuelve GET /api/tickets/{id} (el detalle de uno solo).
// Este si trae description y statusHistory.
export interface Ticket {
id: number
title: string
description: string
status: TicketStatus
priority: TicketPriority
userId: number
createdAt: string
statusHistory: { from: TicketStatus; to: TicketStatus; changedAt: string }[]
}