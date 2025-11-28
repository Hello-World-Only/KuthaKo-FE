import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // 🔥 Allow access from phone & other devices
    port: 5173, // Optional: set fixed port
    strictPort: false, // If busy, Vite can pick another port
  },
});
