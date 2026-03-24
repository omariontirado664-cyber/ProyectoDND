import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite" // Importación correcta

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss() // <--- DEBE ir aquí adentro con paréntesis
  ],
})
