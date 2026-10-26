import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ffmpeg.wasm spawns its worker via import.meta.url; prebundling breaks that path.
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
  // Workers take their CSP from their own response, and Vercel's 304 omits headers, so a
  // browser that cached a worker under an older CSP keeps it. Bump the suffix when the CSP changes.
  worker: {
    rollupOptions: {
      output: { entryFileNames: 'assets/[name]-[hash]-csp2.js' },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
})
