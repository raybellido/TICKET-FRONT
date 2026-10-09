import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // './' = rutas relativas: la app funciona igual en localhost que bajo
  // https://raybellido.github.io/TICKET-FRONT/ (Pages la sirve en subruta).
  base: "./",
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})
