/* eslint-disable import/no-extraneous-dependencies */
import { PluginOption } from "vite";

export default function inlineScript(): PluginOption {
  return {
    name: "inline-script",
    enforce: "post",
    generateBundle(_, bundle) {
      console.log(Object.keys(bundle));
      const htmlFiles = Object.keys(bundle).filter((i) => i.endsWith(".html"));
      const bundlesToDelete: string[] = [];
      for (const name of htmlFiles) {
        console.log(name);
        const chunk = bundle[name];
        if (chunk.type === "asset" && typeof chunk.source === "string") {
          chunk.source = chunk.source.replaceAll(
            /<script([\s\S]*?) src=["']([\s\S]*?)["']([\s\S]*?)>[\s\S]*?<\/script>/gi,
            (_, beforeSrc: string, src: string, afterSrc: string) => {
              const source = bundle[src.slice(1)];
              if (!source || source.type !== "chunk")
                throw new Error("Cannot find script chunk");
              bundlesToDelete.push(src.slice(1));
              return `<script${beforeSrc}${afterSrc}>${source.code}</script>`;
            }
          );
        }
      }
      for (const name of bundlesToDelete) {
        // eslint-disable-next-line no-param-reassign
        delete bundle[name];
      }
    },
  };
}
