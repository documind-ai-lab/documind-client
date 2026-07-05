import react from "@vitejs/plugin-react";
import styleX from "@stylexjs/unplugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    styleX.vite({
      dev: process.env.NODE_ENV !== "production",
      runtimeInjection: false,
      useCSSLayers: true
    })
  ],
  optimizeDeps: {
    exclude: ["@astryxdesign/core"]
  },
  resolve: {
    conditions: ["source"],
    alias: {
      "@": "/src"
    }
  }
});
