import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BASE_DIR = process.env.BASE_DIR || ''

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  base: BASE_DIR
})