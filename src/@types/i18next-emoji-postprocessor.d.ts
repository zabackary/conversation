declare module "i18next-emoji-postprocessor" {
  export interface Options {
    wordSeparator: string;
  }
  const emoji: {
    name: "emoji";
    type: "postProcessor";
    options: Options;
    setOptions: (options: Partial<Options>) => void;
    process: (value: string, key: string, options: Partial<Options>) => string;
    overloadTranslationOptionHandler: () => { postProcess: "emoji" };
  };
  export default emoji;
}
