import { getToken } from "./authService"

// En local vale localhost. En GitHub Actions se inyecta con la variable
// VITE_API_URL (ver .github/workflows/deploy.yml y .env.example).
// El ?? significa "si no viene definida, usa localhost".
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080"

// Hace fetch añadiendo el token solo. Los servicios ya no reciben el token
// como parametro: lo leen de aqui dentro.
// El 401 se maneja en un solo sitio porque significa lo mismo en todos
// los endpoints: no hay sesion valida.
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken()

  // Sin token ni siquiera llamamos al backend: ya sabemos que daria 401.
  if (!token) {
    throw new Error("No has iniciado sesion")
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${token}` },
  })
  console.log("probando 1" + res)

  if (res.status === 401) {
    throw new Error("Sesion expirada, vuelve a iniciar sesion")
  }

  // Devolvemos la respuesta tal cual para que cada servicio decida
  // que hacer con los demas errores (403, 404, 500...).
  return res
}
