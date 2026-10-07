import { apiFetch } from "./api"
import type { CreateUserInput, User, UserRole } from "../types/user"

// Crea un usuario. Solo ADMIN (el backend da 403 al resto).
// Devuelve 201 con el usuario creado, que ya trae su id.
export async function createUser(input: CreateUserInput): Promise<User> {
  const res = await apiFetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  if (res.status === 403) {
    throw new Error("Necesitas ser ADMIN para hacer esto")
  }

  if (res.status === 400) {
    throw new Error("Revisa los campos: nombre, email valido y contrasena")
  }

  if (!res.ok) {
    throw new Error("No se pudo crear el usuario")
  }

  return res.json()
}

// Cambia el rol de un usuario. Solo ADMIN.
// Como el backend no tiene lista de usuarios, el id hay que saberlo
// (el create de arriba lo devuelve).
export async function changeUserRole(userId: number, role: UserRole): Promise<User> {
  const res = await apiFetch(`/api/users/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  })

  if (res.status === 403) {
    throw new Error("Necesitas ser ADMIN para hacer esto")
  }

  if (res.status === 404) {
    throw new Error("No existe un usuario con ese id")
  }

  if (!res.ok) {
    throw new Error("No se pudo cambiar el rol")
  }

  return res.json()
}
