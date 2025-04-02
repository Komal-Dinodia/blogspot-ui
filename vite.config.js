import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Allows access from outside the container
    port: 5003,  // Ensures the app runs on port 5003
    strictPort: true, // Ensures Vite doesn't switch to another port
    watch: {
      usePolling: true,
}
}
})
