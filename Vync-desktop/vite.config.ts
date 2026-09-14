import { defineConfig } from "vite";
import path , {resolve} from "node:path";
import electron from "vite-plugin-electron/simple";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  build: {
    emptyOutDir: false,
    manifest: true,
    outDir:"dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname,"index.html"),
        studio_main: resolve(__dirname,"studio.html"),
        webcam_main: resolve(__dirname,"webcam.html")
      }
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  plugins: [
    react(),
    tsConfigPaths(),
    tailwindcss(), // <-- ADD THIS
    electron({
      main: {
        entry: "electron/main.ts",
      },
      preload: {
        input: path.join(__dirname, "electron/preload.ts"),
      },
      renderer: process.env.NODE_ENV === "test" ? undefined : {},
    }),
  ],
});
