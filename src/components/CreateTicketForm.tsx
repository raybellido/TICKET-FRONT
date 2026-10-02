import { useState, type FormEvent } from "react"
import { createTicket } from "../service/ticketService"
import type { TicketPriority, TicketSummary } from "../types/ticket"

// Las 4 prioridades que acepta el backend, en un array para pintar el <select>
// con un .map en vez de escribir 4 <option> a mano.
const PRIORITIES: TicketPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

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
    <form onSubmit={handleSubmit}>
      <h2>Nuevo ticket</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Descripción del problema"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
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

      <button type="submit" disabled={!isValid || creating}>
        {creating ? "Creando..." : "Crear ticket"}
      </button>
    </form>
  )
}

export default CreateTicketForm
