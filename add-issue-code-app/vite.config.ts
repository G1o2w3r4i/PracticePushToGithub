import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Power Apps Code Apps serve the built app from a relative path,
// so base is kept relative. Adjust if your `pac code init` config differs.
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 3000
  }
});
