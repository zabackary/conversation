// @ts-check

// This is a development plugin.
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModifySourcePlugin } from "modify-source-webpack-plugin";

/**
 * Injects Axe into `client/index.tsx`.
 *
 * @returns {import("webpack").WebpackPluginInstance} A WebpackPluginInstance.
 */
export default function ReactAxePlugin() {
  return new ModifySourcePlugin({
    rules: [
      {
        test: /client\/index.tsx/,
        modify(src, _path) {
          const imports = /^[^]*?(?=\r?\n\r?\n)/.exec(src)?.[0];
          const code = /(?<=\r?\n\r?\n)[^]*$/.exec(src)?.[0];
          return `${imports}
import ReactDOM from "react-dom/client";
import axe from "@axe-core/react";

axe(React, ReactDOM, 1000);
${code}`;
        },
      },
    ],
  });
}
