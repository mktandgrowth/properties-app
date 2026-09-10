import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Separa las libs que no cambian entre deploys en chunks propios,
        // así el navegador las cachea y no re-baja ~140KB en cada release.
        manualChunks: {
          vendor: ["react", "react-dom"],
          supabase: ["@supabase/supabase-js"],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
