import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // bütün IP-lərdən girişə icazə
    port: 5131,      // istəsən dəyişə bilərsən
  }
})
