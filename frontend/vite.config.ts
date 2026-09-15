import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Same proxy targets for dev (`vite`) and for previewing the production build
// (`vite preview`), so the built app talks to the FastAPI backend unchanged.
const proxy = {
  "/api": { target: "http://localhost:8000", changeOrigin: true },
  "/webhooks": { target: "http://localhost:8000", changeOrigin: true },
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy,
  },
  preview: {
    port: 4173,
    proxy,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
