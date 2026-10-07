import type { TicketAction } from "../service/ticketService";
import type { Ticket, TicketPriority } from "../types/ticket";

// Las 4 prioridades que acepta el backend (igual que en CreateTicketForm).
const PRIORITIES: TicketPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

interface TicketDetailProps {
  // Ahora recibe el ticket COMPLETO: por eso ya puede pintar description
  // y el historial de estados.
  ticket: Ticket;
  onAction: (ticketId: number, action: TicketAction) => void;
  onPriorityChange: (ticketId: number, priority: TicketPriority) => void;
  // Id del ticket con una peticion en curso (null = ninguno).
  actingId: number | null;
}

function TicketDetail({ ticket, onAction, onPriorityChange, actingId }: TicketDetailProps) {
  // true solo mientras LA PETICION DE ESTE ticket viaja.
  const isBusy = actingId === ticket.id;

  return (
    // Panel mas ancho que la tarjeta: max-w-2xl. space-y-3 = separacion
    // vertical entre hijos directos (no hay que poner margin a cada uno).
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900">Detalle del ticket</h2>

      {/* dl/dt/dd = etiquetas semanticas para "termino: definicion".
          Mejor que <p> sueltos: el navegador entiende que es una ficha. */}
      <dl className="space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="font-medium text-gray-500">Título:</dt>
          <dd className="text-gray-900">{ticket.title}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-gray-500">Descripción:</dt>
          <dd className="text-gray-900">{ticket.description}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-gray-500">Estado:</dt>
          <dd className="text-gray-900">{ticket.status}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="font-medium text-gray-500">Prioridad:</dt>
          <dd>
            {/* La prioridad se edita aqui mismo: al cambiar el <select> se dispara
                la peticion PATCH. Se desactiva mientras viaja, igual que los botones. */}
            <select
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 disabled:opacity-50"
              value={ticket.priority}
              disabled={isBusy}
              onChange={(e) => onPriorityChange(ticket.id, e.target.value as TicketPriority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-gray-500">Usuario:</dt>
          <dd className="text-gray-900">{ticket.userId}</dd>
        </div>
      </dl>

      <h3 className="mt-4 text-sm font-semibold text-gray-900">Historial</h3>
      {ticket.statusHistory.length === 0 ? (
        <p className="text-sm text-gray-500">Sin cambios de estado todavía.</p>
      ) : (
        // list-disc + pl-5 = viñetas clasicas con sangria.
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
          {ticket.statusHistory.map((cambio, i) => (
            // key={i} usa la posicion como clave. Vale aqui porque el historial
            // solo crece al final y nunca se reordena ni se borra.
            <li key={i}>
              {cambio.fromStatus} → {cambio.toStatus} ({new Date(cambio.occurredAt).toLocaleString()})
            </li>
          ))}
        </ul>
      )}

      {/* Cada boton solo sale en su estado: no puedes "resolver" un ticket
          que aun esta OPEN. El backend tampoco lo permitiria. */}
      {ticket.status === "OPEN" && (
        <button
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          onClick={() => onAction(ticket.id, "start")}
          disabled={isBusy}
        >
          {isBusy ? "Iniciando..." : "Iniciar ticket"}
        </button>
      )}

      {ticket.status === "IN_PROGRESS" && (
        <button
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          onClick={() => onAction(ticket.id, "resolve")}
          disabled={isBusy}
        >
          {isBusy ? "Resolviendo..." : "Resolver ticket"}
        </button>
      )}

      {ticket.status === "RESOLVED" && (
        <button
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          onClick={() => onAction(ticket.id, "close")}
          disabled={isBusy}
        >
          {isBusy ? "Cerrando..." : "Cerrar ticket"}
        </button>
      )}
    </div>
  );
}

export default TicketDetail;
