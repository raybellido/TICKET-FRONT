import { useState, type FormEvent } from "react"
import { createTicket } from "../service/ticketService"
import type { TicketPriority, TicketSummary } from "../types/ticket"

// Las 4 prioridades que acepta el backend, en un array para pintar el <select>
// con un .map en vez de escribir 4 <option> a mano.
const PRIORITIES: TicketPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

// Tailwind no tiene variables: para no repetir las clases de cada campo,
// las guardamos en una constante JS y la usamos con className={INPUT}.
const INPUT =
  "w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"

function CreateTicketForm({ onCreated }: { onCreated: (ticket: TicketSummary) => void }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM")
  const [error, setError] = useState("")
  const [creating, setCreating] = useState(false)

  // El boton solo se habilita si titulo y descripcion tienen algo real.
  // .trim() quita espacios: un titulo de "   " cuenta como vacio.
  const isValid = title.trim() !== "" && description.trim() !== ""

  async function handleSubmit(event: FormEvent) {
    event.preventDefault() // sin esto la pagina se recarga y perdemos todo
    if (!isValid) return // doble seguridad: el boton ya viene desactivado
    setError("")
    setCreating(true)

    try {
      const summary = await createTicket({
        title: title.trim(),
        description: description.trim(),
        priority,
      })

      onCreated(summary) // avisamos a la pagina para que lo ponga en la lista

      setTitle("") // limpiamos para dejarlo listo para el siguiente
      setDescription("")
      setPriority("MEDIUM")
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el ticket")
    } finally {
      setCreating(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-900">Nuevo ticket</h2>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <input
        className={INPUT}
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className={INPUT}
        placeholder="Descripción del problema"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        className={INPUT}
        value={priority}
        // e.target.value siempre es string, asi que lo convertimos al tipo
        // TicketPriority. Es seguro porque las unicas opciones son las del array.
        onChange={(e) => setPriority(e.target.value as TicketPriority)}
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <button
        className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        type="submit"
        disabled={!isValid || creating}
      >
        {creating ? "Creando..." : "Crear ticket"}
      </button>
    </form>
  )
}

export default CreateTicketForm
