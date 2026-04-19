import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules")) {
            if (id.includes("lucide-react")) return "vendor-icons"
            if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts"
            if (
              id.includes("react-dom") ||
              id.includes("scheduler") ||
              /node_modules\/react\//.test(id)
            )
              return "vendor-react"
            if (id.includes("react-router-dom") || id.includes("@remix-run"))
              return "vendor-router"
            if (id.includes("radix-ui")) return "vendor-radix"
            if (id.includes("i18next") || id.includes("react-i18next"))
              return "vendor-i18n"
            if (id.includes("sonner")) return "vendor-ui"
            return "vendor-misc"
          }
          if (id.includes("/src/pages/mobile/")) return "route-mobile"
          if (id.includes("/src/pages/guest/")) return "route-guest"
          if (id.includes("/src/pages/kds/")) return "route-kds"
          if (id.includes("/src/pages/auth/")) return "route-auth"
        },
      },
    },
  },
})
