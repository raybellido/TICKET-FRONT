import type { TicketSummary } from "../types/ticket";

const API_URL = "http://localhost:8080";

export async function getTickets(token: string): Promise<TicketSummary[]> {
  const res = await fetch(`${API_URL}/api/tickets`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    throw new Error("Sesion expirada, vuelve a iniciar sesion");
  }

  if (!res.ok) {
    throw new Error("Error al obtener los tickets");
  }

  // El backend devuelve un array de TicketSummary (sin description).
  return res.json();
}
