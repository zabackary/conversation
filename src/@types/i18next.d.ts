import "i18next";

declare module "i18next" {
  // Extend CustomTypeOptions with a dummy object, effectively disabling TS
  // checking for i18next. However, without this, ESLint doesn't work, so oh
  // well.
  //
  // See https://github.com/i18next/i18next/issues/1857 and
  // https://github.com/i18next/i18next/issues/1883
  interface CustomTypeOptions {
    defaultNS: "general";
    resources: Record<string, Record<string, string>>;
  }
}
