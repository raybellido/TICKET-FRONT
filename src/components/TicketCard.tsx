import type {TicketSummary } from "../types/ticket";

interface TicketCardProps {
  ticket: TicketSummary;
  onSelect: (ticket: TicketSummary) => void
}

function TicketCard({ ticket, onSelect }: TicketCardProps) {

  return (
    <div>
      <h2>{ticket.title}</h2>
      <p>Estado: {ticket.status}</p>
      <p>Prioridad: {ticket.priority}</p>
      <p>Creado: {new Date(ticket.createdAt).toLocaleString()}</p>
      <button onClick={() => onSelect(ticket)}>
        Ver ticket
      </button>
    </div>
    
  );
}

export default TicketCard;
