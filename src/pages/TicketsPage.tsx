import { useState, useEffect } from "react";
import { getTickets, getTicketById, changeTicketStatus, toTicketSummary } from "../service/ticketService";
import type { Ticket, TicketSummary, TicketStatus, TicketPriority } from "../types/ticket";
import type { TicketAction } from "../service/ticketService";
import TicketCard from "../components/TicketCard";
import TicketDetail from "../components/TicketDetail";
import CreateTicketForm from "../components/CreateTicketForm";

function TicketsPage({token,onUnauthorized,}: {token: string;onUnauthorized: () => void;}) {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [error, setError] = useState("");
  // selectedTicket guarda el ticket COMPLETO (Ticket), que trae description
  // y statusHistory. La lista sigue usando el resumen (TicketSummary).
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [actingId, setActingId] = useState<number | null>(null)
  // true mientras se carga el detalle de un ticket.
  const [detailLoading, setDetailLoading] = useState(false)
  // Filtros de la lista. "" significa "sin filtro" (todos).
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("")
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "">("")


  // Al seleccionar pedimos el ticket COMPLETO: la tarjeta solo trae el resumen
  // (sin description). Mientras viaja mostramos "Cargando detalle...".
  async function handleSelectTicket(ticket: TicketSummary) {
    setDetailLoading(true)
    setError("")
    try {
      const full = await getTicketById(ticket.id)
      setSelectedTicket(full)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el detalle del ticket")
    } finally {
      setDetailLoading(false)
    }
  }

  // Una sola funcion para iniciar, resolver y cerrar: lo unico que cambia
  // es la accion que manda el boton del detalle.
  async function handleTicketAction(ticketId: number, action: TicketAction) {
    setError("") // limpiamos el error anterior
    setActingId(ticketId) // marcamos este ticket como "en curso"

    try {
      // changeTicketStatus ya devuelve el ticket COMPLETO: lo guardamos directo
      // en el detalle, y pasamos el resumen a la lista con el helper.
      const updatedTicket = await changeTicketStatus(ticketId, action)

      setSelectedTicket(updatedTicket)

      // El backend ya cambio el estado, asi que la lista local se quedo
      // vieja. Actualizamos esa tarjeta para que muestre el estado nuevo.
      setTickets((prev) =>
        prev.map((t) => (t.id === updatedTicket.id ? toTicketSummary(updatedTicket) : t))
      )
    } catch (error) {
      // Sin setError, el fallo solo se veria en la consola y el usuario no
      // sabria que paso (sesion expirada o falta de permisos).
      const message = error instanceof Error ? error.message : "No se pudo actualizar el ticket"
      setError(message)
      if (message.includes("expirada")) onUnauthorized()
    } finally {
      setActingId(null) // termine bien o mal, liberamos el boton
    }
  }

  function handleTicketCreated(ticket: TicketSummary) {
    // Lo ponemos PRIMERO con [ticket, ...prev]: lo nuevo aparece arriba.
    // Usamos la funcion (prev => ...) porque el estado pudo cambiar
    // desde que se dibujo la pantalla.
    setTickets((prev) => [ticket, ...prev])
  }

  useEffect(() => {
    // "" || undefined da undefined: el filtro "todos" se manda como ausente.
    getTickets({
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
    })
      .then(setTickets)
      .catch((err: Error) => {
        setError(err.message);
        if (err.message.includes("expirada")) onUnauthorized();
      });
  }, [token, statusFilter, priorityFilter, onUnauthorized]);

  return (
  <div>
    <h1>Tickets</h1>

    {/* El error ya no esconde la pagina: sale aqui y el resto sigue visible. */}
    {error && <p style={{ color: "red" }}>{error}</p>}

    <CreateTicketForm onCreated={handleTicketCreated} />

    {/* Filtros: al cambiar cualquiera, el useEffect de arriba repite la
        peticion porque statusFilter/priorityFilter estan en sus dependencias. */}
    <div>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "")}
      >
        <option value="">Todos los estados</option>
        <option value="OPEN">OPEN</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="RESOLVED">RESOLVED</option>
        <option value="CLOSED">CLOSED</option>
      </select>

      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | "")}
      >
        <option value="">Todas las prioridades</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
        <option value="CRITICAL">CRITICAL</option>
      </select>
    </div>

    {tickets.length === 0 ? (
      <p>No hay tickets todavia.</p>
    ) : (
      tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onSelect={handleSelectTicket}
        />
      ))
    )}

    {/* Mientras se carga el detalle mostramos un aviso en su lugar. */}
    {detailLoading && <p>Cargando detalle...</p>}

    {/* onAction es la que llama a la API; handleSelectTicket solo elige cual mostrar. */}
    {selectedTicket && !detailLoading && (
      <TicketDetail
        ticket={selectedTicket}
        onAction={handleTicketAction}
        actingId={actingId}
      />
    )}
  </div>
  )
  
}

export default TicketsPage;
