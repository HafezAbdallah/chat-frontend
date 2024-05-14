import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import checkerPlugin from "vite-plugin-checker";
export default defineConfig(({ mode }) => {
  const config = {
    server: {
      port: 3000,
      open: true,
      watch: {
        usePolling: true
      }
    },
    plugins: [
      react(),
      viteTsconfigPaths(),
      svgrPlugin(),
      checkerPlugin({
        typescript: { tsconfigPath: "tsconfig.json" }
      })
    ],

    optimizeDeps: {
      include: ["@mui/material/Tooltip"]
    }
  };
  if (mode === "production") {
    return {
      ...config,
      build: {
        outDir: "build"
      }
    };
  } else {
    return {
      ...config,
      define: {
        global: {},
        stream: {},
        process: {}
      }
    };
  }
});
