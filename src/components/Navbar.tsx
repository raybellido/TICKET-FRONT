// Barra superior. Recibe todo por props: no sabe que existe el login,
// solo pinta segun la vista actual y avisa cuando pulsas algo.
interface NavbarProps {
  view: "tickets" | "users"
  role: string | null
  onNavigate: (view: "tickets" | "users") => void
  onLogout: () => void
}

// Clases del boton de navegacion segun si su vista esta activa.
function navButton(active: boolean) {
  return active
    ? "rounded-md bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700"
    : "rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
}

function Navbar({ view, role, onNavigate, onLogout }: NavbarProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-2 p-4">
        <span className="mr-4 text-lg font-bold text-indigo-600">Helpdesk</span>
        <button className={navButton(view === "tickets")} onClick={() => onNavigate("tickets")}>
          Tickets
        </button>
        {/* El boton Usuarios solo existe para ADMIN. */}
        {role === "ADMIN" && (
          <button className={navButton(view === "users")} onClick={() => onNavigate("users")}>
            Usuarios
          </button>
        )}
        {/* ml-auto = "margen izquierdo automatico": empuja este boton a la derecha. */}
        <button
          className="ml-auto rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          onClick={onLogout}
        >
          Cerrar sesion
        </button>
      </div>
    </header>
  )
}

export default Navbar
