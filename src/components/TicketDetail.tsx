import type { TicketAction } from "../service/ticketService";
import type { Ticket } from "../types/ticket";

interface TicketDetailProps {
  // Ahora recibe el ticket COMPLETO: por eso ya puede pintar description
  // y el historial de estados.
  ticket: Ticket;
  onAction: (ticketId: number, action: TicketAction) => void;
  // Id del ticket con una peticion en curso (null = ninguno).
  actingId: number | null;
}

function TicketDetail({ ticket, onAction, actingId }: TicketDetailProps) {
  // true solo mientras LA PETICION DE ESTE ticket viaja.
  const isBusy = actingId === ticket.id;

  return (
    <div>
      <h2>Detalle del ticket</h2>

      <p>Título: {ticket.title}</p>
      <p>Descripción: {ticket.description}</p>
      <p>Estado: {ticket.status}</p>
      <p>Prioridad: {ticket.priority}</p>
      <p>Usuario: {ticket.userId}</p>

      <h3>Historial</h3>
      {ticket.statusHistory.length === 0 ? (
        <p>Sin cambios de estado todavía.</p>
      ) : (
        ticket.statusHistory.map((cambio, i) => (
          // key={i} usa la posicion como clave. Vale aqui porque el historial
          // solo crece al final y nunca se reordena ni se borra.
          <p key={i}>
            {cambio.fromStatus} → {cambio.toStatus} ({new Date(cambio.occurredAt).toLocaleString()})
          </p>
        ))
      )}

      {/* Cada boton solo sale en su estado: no puedes "resolver" un ticket
          que aun esta OPEN. El backend tampoco lo permitiria. */}
      {ticket.status === "OPEN" && (
        <button onClick={() => onAction(ticket.id, "start")} disabled={isBusy}>
          {isBusy ? "Iniciando..." : "Iniciar ticket"}
        </button>
      )}

      {ticket.status === "IN_PROGRESS" && (
        <button onClick={() => onAction(ticket.id, "resolve")} disabled={isBusy}>
          {isBusy ? "Resolviendo..." : "Resolver ticket"}
        </button>
      )}

      {ticket.status === "RESOLVED" && (
        <button onClick={() => onAction(ticket.id, "close")} disabled={isBusy}>
          {isBusy ? "Cerrando..." : "Cerrar ticket"}
        </button>
      )}
    </div>
  );
}

export default TicketDetail;
