import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite" // Importación correcta

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss() // <--- DEBE ir aquí adentro con paréntesis
  ],
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Esto ayuda a que IONOS no se confunda con archivos muy grandes
    chunkSizeWarningLimit: 1600
  }
})
