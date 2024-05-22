import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: "/web-garage/",
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
