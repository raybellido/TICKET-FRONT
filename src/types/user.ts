// Los 3 roles que existen en el backend (UserRole.java).
export type UserRole = "CUSTOMER" | "AGENT" | "ADMIN"

// Lo que devuelve POST /api/users y PATCH /api/users/{id}/role.
export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

// Lo que el formulario manda al crear. OJO: sin role.
// El backend crea a todos como CUSTOMER; el rol se cambia despues.
export interface CreateUserInput {
  name: string
  email: string
  password: string
}
