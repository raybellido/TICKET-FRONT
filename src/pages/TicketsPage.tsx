import { useState, useEffect } from "react"
import { getTickets } from "../service/ticketService"
import type { TicketSummary } from "../types/ticket"

function TicketsPage({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const [tickets, setTickets] = useState<TicketSummary[]>([])
  const [error, setError] = useState("")

  // useEffect = "esto hazlo despues de dibujar la pantalla".
  // El array del final son las dependencias: si el token cambia, se repite.
  useEffect(() => {
    getTickets(token)
      .then(setTickets) // cuando la promesa resuelve, guardamos los tickets
      .catch((err: Error) => {
        setError(err.message)
        // Si el token caduco, avisamos a App para que vuelva al formulario.
        if (err.message.includes("expirada")) onUnauthorized()
      })
  }, [token, onUnauthorized])

  if (error) return <p style={{ color: "red" }}>{error}</p>
  if (tickets.length === 0) return <p>No hay tickets todavia.</p>

  return (
    <div>
      <h1>Tickets</h1>

      {tickets.map((ticket) => (
        <div key={ticket.id}>
          <h2>{ticket.title}</h2>
          {/* No pintamos description: el endpoint de lista no la devuelve. */}
          <p>Estado: {ticket.status}</p>
          <p>Prioridad: {ticket.priority}</p>
          <p>Creado: {new Date(ticket.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}

export default TicketsPage
