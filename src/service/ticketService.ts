import { apiFetch } from "./api"
import type { Ticket, TicketPriority, TicketStatus, TicketSummary } from "../types/ticket"

// Lo que el formulario manda al crear. La prioridad la pedimos siempre
// (el backend la acepta opcional, pero elegirla es mas claro).
export interface CreateTicketInput {
  title: string
  description: string
  priority: TicketPriority
}

// Convierte el ticket COMPLETO que devuelven POST /api/tickets y /start
// al resumen que usan la lista y el detalle.
export function toTicketSummary(ticket: Ticket): TicketSummary {
  return {
    id: ticket.id,
    title: ticket.title,
    status: ticket.status,
    priority: ticket.priority,
    userId: ticket.userId,
    createdAt: ticket.createdAt,
  }
}

// Ya no recibe el token: apiFetch lo añade solo.
// Devuelve el resumen (sin description): eso es lo que manda GET /api/tickets.
// Filtros opcionales para la lista. Los dos son opcionales: si no mandas
// ninguno, el backend devuelve todos los tickets.
export interface TicketFilters {
  status?: TicketStatus
  priority?: TicketPriority
}

export async function getTickets(filters: TicketFilters = {}): Promise<TicketSummary[]> {
  // URLSearchParams construye "?status=OPEN&priority=HIGH" solo con los
  // filtros que vengan. Si no hay ninguno, la URL queda sin "?".
  const params = new URLSearchParams()
  if (filters.status) params.set("status", filters.status)
  if (filters.priority) params.set("priority", filters.priority)
  const query = params.toString() ? `?${params.toString()}` : ""

  const res = await apiFetch(`/api/tickets${query}`)

  if (!res.ok) {
    throw new Error("Error al obtener los tickets")
  }

  return res.json()
}

// Crea un ticket. Cualquier rol puede hacerlo (incluso CUSTOMER):
// el backend asigna el ticket al usuario del token si no mandas userId.
export async function createTicket(input: CreateTicketInput): Promise<TicketSummary> {
  const res = await apiFetch("/api/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  // 400 significa que la validacion del backend rechazo algo
  // (titulo o descripcion vacios).
  if (res.status === 400) {
    throw new Error("Revisa los campos: titulo y descripcion son obligatorios")
  }

  if (!res.ok) {
    throw new Error("No se pudo crear el ticket")
  }

  // POST devuelve 201 con el ticket COMPLETO: lo pasamos a resumen.
  const ticket: Ticket = await res.json()
  return toTicketSummary(ticket)
}

// Trae UN ticket completo (con description y statusHistory).
// Se usa al pulsar "Ver ticket": la lista solo trae el resumen.
export async function getTicketById(ticketId: number): Promise<Ticket> {
  const res = await apiFetch(`/api/tickets/${ticketId}`)

  if (!res.ok) {
    throw new Error("No se pudo cargar el detalle del ticket")
  }

  return res.json()
}

// Las 3 acciones que cambian el estado de un ticket. El backend tiene un
// endpoint para cada una: POST /api/tickets/{id}/start|resolve|close.
// Las 3 exigen ser AGENT o ADMIN (@PreAuthorize en el backend).
export type TicketAction = "start" | "resolve" | "close"

// Una sola funcion para las 3 acciones: lo unico que cambia es la ultima
// palabra de la URL. Devuelve el ticket COMPLETO (con description y statusHistory).
export async function changeTicketStatus(ticketId: number, action: TicketAction): Promise<Ticket> {
  const res = await apiFetch(`/api/tickets/${ticketId}/${action}`, {
    method: "POST",
  })

  // El 401 ya lo maneja apiFetch. El 403 es propio de estos endpoints.
  if (res.status === 403) {
    throw new Error("Necesitas ser AGENT o ADMIN para hacer esto")
  }

  if (!res.ok) {
    throw new Error("No se pudo actualizar el ticket")
  }

  return res.json()
}
