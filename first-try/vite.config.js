// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  root: "public",
  build: {
    outDir: "../dist",
  },
  server: {
    port: 3003,
    fs: {
      allow: [".."], // Allow serving files from one level up to access the client directory
    },
  },
});
