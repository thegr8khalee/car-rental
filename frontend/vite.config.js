import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@branding-config': resolve(__dirname, '..', 'branding.config.json'),
    },
  },
  server: {
    fs: {
      allow: [resolve(__dirname, '..')],
    },
    host: true, // allow external access (e.g. ngrok tunnels)
    // Override at runtime via VITE_DEV_ORIGIN when tunneling in.
    ...(process.env.VITE_DEV_ORIGIN
      ? {
          origin: process.env.VITE_DEV_ORIGIN,
          cors: { origin: process.env.VITE_DEV_ORIGIN, credentials: true },
        }
      : {}),
  },
});
