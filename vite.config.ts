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
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  },
  resolve: {
    conditions: ["source"],
    alias: {
      "@": "/src"
    }
  }
});
