import "i18next";
import resources from "../translations.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    defaultNS: "general";
    resources: typeof resources["en-US"];
  }
}
