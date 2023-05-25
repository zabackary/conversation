/* eslint-disable import/no-extraneous-dependencies */
import react from "@vitejs/plugin-react";
import { exec as nodeExec } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";
import packageJson from "./package.json";
import gasTopLevel from "./plugins/gasTopLevel";
import gasUpload from "./plugins/gasUpload";
import inlineScript from "./plugins/inlineScript";
import inlineSvg from "./plugins/inlineSvg";
import reactAxe from "./plugins/reactAxe";

const exec = promisify(nodeExec);

export default defineConfig(async ({ command, mode, ssrBuild: _ssrBuild }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      __BUILD_TIMESTAMP__: `"${new Date().toISOString()}"`,
      __VERSION__: `"${packageJson.version}"`,
      __COMMIT_HASH__: `"${(await exec("git rev-parse HEAD")).stdout.trim()}"`,
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
      chunkSizeWarningLimit: Infinity,
      assetsInlineLimit: Infinity,
      // Disable minification of the server code since load times don't matter
      // and for easier debugging
      minify: !env.VITE_ONLYSERVER,
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
        filename: env.VITE_ONLYCLIENT
          ? "treemap-client.html"
          : env.VITE_ONLYSERVER
          ? "treemap-server.html"
          : "treemap.html",
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
