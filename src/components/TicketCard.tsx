import type {TicketSummary, TicketStatus, TicketPriority } from "../types/ticket";

interface TicketCardProps {
  ticket: TicketSummary;
  onSelect: (ticket: TicketSummary) => void
}

// Cada estado tiene su color. Record<Estado, clases> = "para cada estado,
// estas clases". Si el backend añadiera un estado nuevo, TypeScript te
// obligaria a añadir su color aqui (si no, error de compilacion).
const STATUS_STYLES: Record<TicketStatus, string> = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-600",
};

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-sky-100 text-sky-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
};

function TicketCard({ ticket, onSelect }: TicketCardProps) {

  return (
    // rounded-lg = esquinas redondeadas, border = borde fino,
    // shadow-sm = sombra suave, hover:shadow-md = sombra mas grande al pasar el raton.
    <div className="rounded-2xl border border-gray-200 bg-blue-50 p-4 shadow-sm transition hover:shadow-md">
      <h2 className="text-lg font-semibold text-gray-900">{ticket.title}</h2>

      {/* Las "pildoras": rounded-full las hace ovaladas, text-xs las hace pequeñas. */}
      <div className="mt-2 flex flex-wrap gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[ticket.status]}`}>
          {ticket.status}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[ticket.priority]}`}>
          {ticket.priority}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Creado: {new Date(ticket.createdAt).toLocaleString()}
      </p>

      <button
        className="mt-3 w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        onClick={() => onSelect(ticket)}
      >
        Ver ticket
      </button>
    </div>

  );
}

export default TicketCard;
