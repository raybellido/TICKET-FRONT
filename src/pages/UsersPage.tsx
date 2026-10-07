import { useState, type FormEvent } from "react"
import { createUser, changeUserRole } from "../service/userService"
import type { UserRole } from "../types/user"

const ROLES: UserRole[] = ["CUSTOMER", "AGENT", "ADMIN"]

// Mismo truco que en CreateTicketForm: constante para no repetir clases.
const INPUT =
  "w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"

function UsersPage() {
  // Formulario 1: crear usuario.
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Formulario 2: cambiar rol. El id va como texto porque viene de un input,
  // y lo convertimos a numero solo al enviar.
  const [userId, setUserId] = useState("")
  const [role, setRole] = useState<UserRole>("AGENT")

  // A diferencia de las otras paginas, aqui mostramos exito ADEMAS de error:
  // crear algo pide confirmacion ("se creo con id 582").
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const canCreate = name.trim() !== "" && email.trim() !== "" && password.trim() !== ""
  const canChangeRole = userId.trim() !== ""

  async function handleCreate(event: FormEvent) {
    event.preventDefault()
    if (!canCreate) return
    setError("")
    setMessage("")
    setBusy(true)

    try {
      const user = await createUser({
        name: name.trim(),
        email: email.trim(),
        password: password,
      })

      // Apunta este id: como no hay lista de usuarios, lo necesitaras
      // para cambiarle el rol en el formulario de abajo.
      setMessage(`Usuario creado con id ${user.id} (${user.email})`)
      setName("")
      setEmail("")
      setPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el usuario")
    } finally {
      setBusy(false)
    }
  }

  async function handleChangeRole(event: FormEvent) {
    event.preventDefault()
    if (!canChangeRole) return
    setError("")
    setMessage("")
    setBusy(true)

    try {
      const user = await changeUserRole(Number(userId), role)
      setMessage(`Rol de ${user.email} ahora es ${user.role}`)
      setUserId("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar el rol")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <h1 className="text-2xl font-bold text-gray-900">Usuarios (solo ADMIN)</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}

      {/* En movil una columna, desde md dos: un formulario al lado del otro. */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <form
          onSubmit={handleCreate}
          className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900">Crear usuario</h2>

          <input
            className={INPUT}
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className={INPUT}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className={INPUT}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            type="submit"
            disabled={!canCreate || busy}
          >
            {busy ? "Creando..." : "Crear usuario"}
          </button>
        </form>

        <form
          onSubmit={handleChangeRole}
          className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900">Cambiar rol</h2>

          <input
            className={INPUT}
            type="number"
            placeholder="Id del usuario"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          <select
            className={INPUT}
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <button
            className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            type="submit"
            disabled={!canChangeRole || busy}
          >
            {busy ? "Guardando..." : "Cambiar rol"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UsersPage
