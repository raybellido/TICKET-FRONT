import { useState, useCallback, type FormEvent } from "react"
import { login, getToken, logout } from "./service/authService"
import TicketsPage from "./pages/TicketsPage"

function App() {
  // useState = una variable que React recuerda entre renders y que, si cambia,
  // vuelve a dibujar la pantalla. El valor inicial se lee UNA vez al arrancar.
  // Por eso el token se lee de localStorage aqui y no en cada render.
  const [token, setToken] = useState(getToken())

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
  }, [])

  // Si no hay token, pintamos el formulario. Este return se salta el de abajo.
  if (!token) {
    return (
      <form onSubmit={handleSubmit}>
        <h1>Helpdesk - Iniciar sesion</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          // onChange se dispara en cada tecla. e.target es el input,
          // y e.target.value es lo que hay escrito ahora mismo.
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contrasena"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Entrar</button>

        {/* Atajo para no teclear el admin cada vez */}
        <button
          type="button"
          onClick={() => {
            setEmail("admin@helpdesk.com")
            setPassword("admin123")
          }}
        >
          Rellenar admin
        </button>
      </form>
    )
  }

  // Si llegamos aqui, es que si hay token.
  return (
    <>
      <button onClick={handleLogout}>Cerrar sesion</button>
      <TicketsPage token={token} onUnauthorized={handleLogout} />
    </>
  )
}

export default App
