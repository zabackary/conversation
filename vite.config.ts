/* eslint-disable import/no-extraneous-dependencies */
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";
import gasTopLevel from "./plugins/gasTopLevel";
import gasUpload from "./plugins/gasUpload";
import inlineScript from "./plugins/inlineScript";
import reactAxe from "./plugins/reactAxe";

export default defineConfig(({ command, mode, ssrBuild: _ssrBuild }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      __BUILD_TIMESTAMP__: `"${new Date().toISOString()}"`,
    },
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
      chunkSizeWarningLimit: 999999,
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
      ...(command === "build"
        ? [
            gasTopLevel({
              entry: /src\/server\/index.ts/,
              distEntry: /server/,
              sideEffect: "globalThis.setTimeout=(a)=>{a()};",
            }),
            inlineScript(),
          ]
        : []),
      ...(env.VITE_UPLOADONCOMPLETE ? [gasUpload()] : []),
    ],
  };
});
