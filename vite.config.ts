/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

const env = process.env.NODE_ENV || "production";

export default defineConfig({
  root: "src",
  build: {
    // Relative to the root
    outDir: "../dist",
  },
  plugins: [
    createHtmlPlugin({
      template: "./client/index.html",
      inject: {
        data: {
          title:
            env === "production"
              ? "Conversation"
              : `Conversation [${env.toUpperCase()}]`,
        },
      },
    }),
  ],
});
