import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import removeConsole from "vite-plugin-remove-console";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), removeConsole()],
  build: {
    outDir: path.resolve(__dirname, "../backend/public"),
    emptyOutDir: true,
  },
});
