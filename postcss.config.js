// PostCSS procesa el CSS antes que Vite: aqui Tailwind lee tus className
// y genera solo los estilos que usas. (El plugin de Vite no es compatible
// con Vite 8, por eso se usa esta via.)
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
