// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // อัปเดตแอปให้อัตโนมัติเมื่อมีเวอร์ชันใหม่
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'] // บอกให้ PWA เก็บไฟล์เหล่านี้ไว้ใช้ออฟไลน์
      },
      manifest: {
        // --- แก้ไขข้อมูลตรงนี้ ---
        name: 'Pedi-Dose Calc by Sabot Hospital',
        short_name: 'Pedi-Dose',
        description: 'โปรแกรมคำนวณขนาดยาน้ำเด็ก โดยกลุ่มงานเภสัชกรรม โรงพยาบาลสระโบสถ์',
        theme_color: '#ffffff', // สีพื้นหลังของ Splash Screen
        background_color: '#ffffff', // สีของ status bar บนมือถือ
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'icon-192x192.png', // ชื่อไฟล์ icon
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png', // ชื่อไฟล์ icon
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // สำหรับแสดงผลบน Android ให้สวยงาม
          }
        ]
      }
    })
  ],
})