import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
  ],
  build: {
    chunkSizeWarningLimit: 1000, // Ajusta o limite do aviso para 1000KB (opcional)
    target: 'esnext' ,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Separa dependências em um chunk "vendor"
          }
        },
      },
    },
  },
})
