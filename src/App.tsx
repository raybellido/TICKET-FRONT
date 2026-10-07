import { useState, useCallback, type FormEvent } from "react"
import { login, getToken, getRole, logout } from "./service/authService"
import TicketsPage from "./pages/TicketsPage"
import UsersPage from "./pages/UsersPage"

function App() {
  // useState = una variable que React recuerda entre renders y que, si cambia,
  // vuelve a dibujar la pantalla. El valor inicial se lee UNA vez al arrancar.
  // Por eso el token se lee de localStorage aqui y no en cada render.
  const [token, setToken] = useState(getToken())
  // El rol decide que se muestra: la vista Usuarios solo sale si eres ADMIN.
  // Es solo UX: si un CUSTOMER adivinara la vista, el backend le daria 403 igual.
  const [role, setRole] = useState(getRole())
  // Vista actual. Empieza en tickets; no hay router, es un simple estado.
  const [view, setView] = useState<"tickets" | "users">("tickets")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Esta funcion se dispara al pulsar el boton "Entrar".
  // El await significa: "espera a que el backend responda antes de seguir".
  async function handleSubmit(event: FormEvent) {
    event.preventDefault() // sin esto, la pagina se recarga y perdemos todo
    setError("") // limpiamos el error anterior

    try {
      const data = await login(email, password)

      // Al cambiar token, React vuelve a dibujar. Y como ahora hay token,
      // el codigo de abajo ya no pinta el formulario.
      setToken(data.accessToken)
      setRole(data.role)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal")
    }
  }

  // useCallback = como useState pero para funciones.
  // El [] del final significa "no depende de nada", asi que React devuelve
  // SIEMPRE la misma funcion. Si no lo hicieramos asi, TicketsPage volveria
  // a pedir los tickets en cada render (bucle infinito de peticiones).
  const handleLogout = useCallback(() => {
    logout()
    setToken(null) // volvemos al formulario
    setRole(null)
    setView("tickets")
  }, [])

  // Si no hay token, pintamos el formulario. Este return se salta el de abajo.
  if (!token) {
    return (
      // min-h-screen + items-center + justify-center = tarjeta centrada
      // en vertical y horizontal, ocupe lo que ocupe la pantalla.
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-3 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h1 className="text-2xl font-bold text-gray-900">Helpdesk - Iniciar sesion</h1>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <input
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            type="email"
            placeholder="Email"
            value={email}
            // onChange se dispara en cada tecla. e.target es el input,
            // y e.target.value es lo que hay escrito ahora mismo.
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            type="password"
            placeholder="Contrasena"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            type="submit"
          >
            Entrar
          </button>

          {/* Atajo para no teclear el admin cada vez */}
          <button
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            type="button"
            onClick={() => {
              setEmail("admin@helpdesk.com")
              setPassword("admin123")
            }}
          >
            Rellenar admin
          </button>
        </form>
      </div>
    )
  }

  // Si llegamos aqui, es que si hay token.
  return (
    <>
      <button onClick={handleLogout}>Cerrar sesion</button>
      <button onClick={() => setView("tickets")}>Tickets</button>
      {/* Sin router: la "navegacion" es un estado que elige que pagina pintar.
          El boton Usuarios solo existe para ADMIN. */}
      {role === "ADMIN" && (
        <button onClick={() => setView("users")}>Usuarios</button>
      )}
      {view === "users" && role === "ADMIN" ? (
        <UsersPage />
      ) : (
        <TicketsPage token={token} onUnauthorized={handleLogout} />
      )}
    </>
  )
}

export default App
