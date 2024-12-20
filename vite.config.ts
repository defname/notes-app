import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const BASE_DIR = (process.env.BASE_DIR === "" || process.env.BASE_DIR === "/./") ? "" : process.env.BASE_DIR

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'notes.png', 'notes.svg', "web-app-manifest-192x192.png", "web-app-manifest-512x512.png"],
      manifest: {
        name: 'Notes App',
        short_name: 'Notes',
        description: 'An app for managing notes and relations between them.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: 'web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        screenshots: [
          {
            src: "screenshot-600x400.png",
            sizes: "600x400",
            type: "image/png",
            form_factor: "narrow"
          },
          {
            src: "screenshot-400x600.png",
            sizes: "400x600",
            type: "image/png",
            form_factor: "wide"
          }
        ]
      }
    })],
  resolve: {
    alias: {
      // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  base: BASE_DIR
})
