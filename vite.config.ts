import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'; ``

export default defineConfig({
  base: '/mortar-ruler/',
  plugins: [
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png'],
      manifest: {
        name: 'Mortar Ruler',
        short_name: 'Mortar Ruler',
        description: 'App calculates the distance between the offset and target lines in a mortar joint.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'fullscreen',
        orientation: 'landscape-primary',
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: 'any'
          },
          {
            src: "/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
            purpose: 'any'
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: 'any'
          },
          {
            src: "/icons/icon-192x192-maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: 'maskable'
          },
          {
            src: "/icons/icon-512x512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
})