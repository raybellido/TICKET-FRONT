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

// Un cambio de estado dentro del historial. Los nombres de las propiedades son
// fromStatus / toStatus / occurredAt (asi los devuelve el backend).
export interface TicketStatusTransition {
fromStatus: TicketStatus
toStatus: TicketStatus
occurredAt: string
}

// Este type lo devuelve GET /api/tickets/{id} y todos los POST que cambian estado
// (start, resolve, close...). Este si trae description y statusHistory.
export interface Ticket {
id: number
title: string
description: string
status: TicketStatus
priority: TicketPriority
userId: number
createdAt: string
statusHistory: TicketStatusTransition[]
}