import type { Ticket, TicketPriority, TicketStatus } from "../types/ticket"
import type { User, UserRole } from "../types/user"

// true cuando se compila con VITE_USE_MOCKS=true (demo en GitHub Pages,
// donde no hay backend). En local vale false y todo va al backend real.
// Se lee en tiempo de compilacion: cada build queda con un modo fijo.
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true"

// Pequeña espera para que los "Cargando..." se vean igual que con red real.
async function delay() {
  await new Promise((resolve) => setTimeout(resolve, 300))
}

function now() {
  return new Date().toISOString()
}

// Base de mentira: vive en memoria y SE PIERDE AL RECARGAR (F5).
// Por eso sirve para la demo pero nunca para datos de verdad.
let tickets: Ticket[] = [
  {
    id: 1,
    title: "Impresora del segundo piso no imprime",
    description: "Sale en blanco desde ayer",
    status: "IN_PROGRESS",
    priority: "HIGH",
    userId: 3,
    createdAt: "2026-10-01T10:00:00.000Z",
    statusHistory: [
      { fromStatus: "OPEN", toStatus: "IN_PROGRESS", occurredAt: "2026-10-02T10:00:00.000Z" },
    ],
  },
  {
    id: 2,
    title: "El mouse no funciona",
    description: "No responde desde ayer",
    status: "OPEN",
    priority: "LOW",
    userId: 4,
    createdAt: "2026-10-03T10:00:00.000Z",
    statusHistory: [],
  },
  {
    id: 3,
    title: "VPN se cae cada hora",
    description: "Hay que reconectar manualmente",
    status: "RESOLVED",
    priority: "CRITICAL",
    userId: 4,
    createdAt: "2026-09-28T10:00:00.000Z",
    statusHistory: [
      { fromStatus: "OPEN", toStatus: "IN_PROGRESS", occurredAt: "2026-09-28T11:00:00.000Z" },
      { fromStatus: "IN_PROGRESS", toStatus: "RESOLVED", occurredAt: "2026-09-29T11:00:00.000Z" },
    ],
  },
]

let users: User[] = [
  { id: 3, name: "Admin", email: "admin@helpdesk.com", role: "ADMIN" },
  { id: 4, name: "Cliente Demo", email: "cliente@test.com", role: "CUSTOMER" },
  { id: 5, name: "Agente Demo", email: "agente1@test.com", role: "AGENT" },
]

// Contraseñas de mentira (en el backend real estan cifradas con BCrypt).
const PASSWORDS: Record<string, string> = {
  "admin@helpdesk.com": "admin123",
  "cliente@test.com": "cliente123",
  "agente1@test.com": "agente123",
}

let nextTicketId = 10
let nextUserId = 10

// Quien entro con el mock: el token falso lleva el id (mock-token-4),
// asi crear ticket asigna el dueño igual que el backend.
let currentUserId = 0

export async function mockLogin(email: string, password: string) {
  await delay()

  const user = users.find((u) => u.email === email)
  if (!user || PASSWORDS[email] !== password) {
    throw new Error("Credenciales invalidas")
  }

  currentUserId = user.id

  // Misma forma que LoginResponse del backend: el resto del codigo
  // no nota la diferencia entre mock y real.
  return {
    accessToken: `mock-token-${user.id}`,
    tokenType: "Bearer",
    userId: user.id,
    email: user.email,
    role: user.role,
  }
}

export async function mockListTickets(filters: {
  status?: TicketStatus
  priority?: TicketPriority
}): Promise<Ticket[]> {
  await delay()

  // Igual que el backend: sin filtro devuelve todo (el listado real
  // filtra por dueño, pero la demo es de un solo jugador).
  return tickets
    .filter((t) => !filters.status || t.status === filters.status)
    .filter((t) => !filters.priority || t.priority === filters.priority)
    .map((t) => ({ ...t, statusHistory: [...t.statusHistory] }))
}

export async function mockGetTicketById(ticketId: number): Promise<Ticket> {
  await delay()

  const ticket = tickets.find((t) => t.id === ticketId)
  if (!ticket) {
    throw new Error("No se pudo cargar el detalle del ticket")
  }

  return { ...ticket, statusHistory: [...ticket.statusHistory] }
}

export async function mockCreateTicket(input: {
  title: string
  description: string
  priority: TicketPriority
}): Promise<Ticket> {
  await delay()

  const ticket: Ticket = {
    id: nextTicketId++,
    title: input.title,
    description: input.description,
    status: "OPEN",
    priority: input.priority,
    userId: currentUserId,
    createdAt: now(),
    statusHistory: [],
  }

  // Lo nuevo arriba, igual que hace la pagina con la respuesta real.
  tickets = [ticket, ...tickets]

  return { ...ticket, statusHistory: [] }
}

export async function mockChangeStatus(
  ticketId: number,
  action: "start" | "resolve" | "close"
): Promise<Ticket> {
  await delay()

  const ticket = tickets.find((t) => t.id === ticketId)
  if (!ticket) {
    throw new Error("No se pudo actualizar el ticket")
  }

  // Sin validaciones de estado: la demo no necesita las reglas del backend.
  const next = action === "start" ? "IN_PROGRESS" : action === "resolve" ? "RESOLVED" : "CLOSED"
  ticket.statusHistory.push({ fromStatus: ticket.status, toStatus: next, occurredAt: now() })
  ticket.status = next

  return { ...ticket, statusHistory: [...ticket.statusHistory] }
}

export async function mockUpdatePriority(
  ticketId: number,
  priority: TicketPriority
): Promise<Ticket> {
  await delay()

  const ticket = tickets.find((t) => t.id === ticketId)
  if (!ticket) {
    throw new Error("No se pudo cambiar la prioridad")
  }

  ticket.priority = priority

  return { ...ticket, statusHistory: [...ticket.statusHistory] }
}

export async function mockCreateUser(input: {
  name: string
  email: string
  password: string
}): Promise<User> {
  await delay()

  // Igual que el backend: nace CUSTOMER, el rol se cambia despues.
  const user: User = {
    id: nextUserId++,
    name: input.name,
    email: input.email,
    role: "CUSTOMER",
  }

  users = [...users, user]
  PASSWORDS[input.email] = input.password

  return user
}

export async function mockChangeRole(userId: number, role: UserRole): Promise<User> {
  await delay()

  const user = users.find((u) => u.id === userId)
  if (!user) {
    throw new Error("No existe un usuario con ese id")
  }

  user.role = role

  return { ...user }
}
