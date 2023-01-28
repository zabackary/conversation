/* eslint-disable import/no-extraneous-dependencies */
import { PluginOption } from "vite";

/**
 * Injects Axe into `client/index.tsx`.
 */
export default function reactAxe(): PluginOption {
  return {
    name: "react-axe",
    transform: (source, id) => {
      if (!/client\/index.tsx/.test(id)) return source;
      const imports = /^[^]*?(?=\r?\n\r?\n)/.exec(source)?.[0];
      const code = /(?<=\r?\n\r?\n)[^]*$/.exec(source)?.[0];
      return `${imports}
import ReactDOM from "react-dom/client";
import axe from "@axe-core/react";

axe(React, ReactDOM, 1000);
${code}`;
    },
    apply: "serve",
  };
}
