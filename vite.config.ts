/* eslint-disable import/no-extraneous-dependencies */
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";
import packageJson from "./package.json";
import gasTopLevel from "./plugins/gasTopLevel";
import gasUpload from "./plugins/gasUpload";
import inlineScript from "./plugins/inlineScript";
import inlineSvg from "./plugins/inlineSvg";
import reactAxe from "./plugins/reactAxe";

const BIG = 99999999;

export default defineConfig(({ command, mode, ssrBuild: _ssrBuild }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      __BUILD_TIMESTAMP__: `"${new Date().toISOString()}"`,
      __VERSION__: `"${packageJson.version}"`,
    },
    envPrefix: "CLIENT_",
    build: {
      // Relative to the root
      outDir: "dist",
      emptyOutDir: !env.VITE_SECONDPASS,
      assetsDir: "",
      rollupOptions: {
        output: {
          chunkFileNames: "[name].js",
          entryFileNames: "[name].js",
        },
        input: {
          ...(env.VITE_ONLYCLIENT
            ? {}
            : {
                server: fileURLToPath(
                  new URL("./src/server/index.ts", import.meta.url)
                ),
              }),
          ...(env.VITE_ONLYSERVER
            ? {}
            : {
                client: fileURLToPath(new URL("./index.html", import.meta.url)),
              }),
        },
      },
      chunkSizeWarningLimit: BIG,
      assetsInlineLimit: BIG,
    },
    plugins: [
      react({
        include: "**/*.{jsx,tsx}",
      }),
      checker({
        typescript: {
          tsconfigPath: "./tsconfig.json",
        },
        eslint: {
          lintCommand: "eslint",
        },
      }),
      reactAxe(),
      visualizer({
        template: "treemap",
        open: true,
        filename: "treemap.html",
      }),
      gasTopLevel({
        entry: /src\/server\/index.ts/,
        distEntry: /server/,
        sideEffect: "globalThis.setTimeout=(a)=>{a()};",
      }),
      inlineScript(),
      inlineSvg(),
      ...(env.VITE_UPLOADONCOMPLETE ? [gasUpload()] : []),
    ],
  };
});
