// La direccion del backend. La dejamos aqui arriba para tenerla en un solo sitio.
const API_URL = "http://localhost:8080"

// Clave con la que guardamos el token en el navegador.
const TOKEN_KEY = "helpdesk_token"

// Clave con la que guardamos el rol. Hace falta para mostrar u ocultar
// cosas segun el rol (por ejemplo, el panel de usuarios solo para ADMIN).
// OJO: esto es solo UX, la seguridad real esta en el backend (403).
const ROLE_KEY = "helpdesk_role"

// Hace el POST de login. Si va bien devuelve los datos con el token.
// Si va mal lanza un error con un mensaje que se puede mostrar en pantalla.
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  // El backend responde 401 si el email o la contrasena no existen.
  if (res.status === 401) {
    throw new Error("Credenciales invalidas")
  }

  if (!res.ok) {
    throw new Error("No se pudo iniciar sesion")
  }

  // El backend responde algo asi:
  // { accessToken: "eyJraWQi...", tokenType: "Bearer", userId: 1, role: "ADMIN" }
  const data = await res.json()

  // Guardamos el token en localStorage para que no se pierda al recargar la pagina.
  // localStorage es un almacen del navegador que sobrevive al F5.
  localStorage.setItem(TOKEN_KEY, data.accessToken)
  // Y el rol, para decidir que mostrar (panel admin solo si eres ADMIN).
  localStorage.setItem(ROLE_KEY, data.role)

  return data
}

// Lee el token guardado. Lo llamamos al arrancar la app.
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

// Lee el rol guardado ("CUSTOMER", "AGENT", "ADMIN" o null si no hay sesion).
export function getRole(): string | null {
  return localStorage.getItem(ROLE_KEY)
}

// Borra el token (al pulsar "cerrar sesion" o cuando el token caduca).
export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ROLE_KEY)
}
