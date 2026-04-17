import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 重要：把 'your-repo-name' 換成你 GitHub 儲存庫的名字
  // 記得前後都要有斜線，例如 '/ff14-marker-trainer/'
  base: "/awuuu0716.github.io/",
  server: {
    port: 3010,
  },
});
