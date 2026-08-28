import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    // Allow Cloudflare/localtunnel URLs when previewing from a remote dev VM.
    allowedHosts: true,
  },
});
