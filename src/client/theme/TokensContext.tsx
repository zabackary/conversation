import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import { M3ColorTokens } from "./M3Theme";
import generateTokens, {
  generateTokensFromSourceColor,
} from "./tokensGenerator";

export const DEFAULT_THEME_SOURCE_COLOR = "#efa0ff";
export const DEFAULT_TOKENS = generateTokensFromSourceColor(
  DEFAULT_THEME_SOURCE_COLOR
);

const LOCAL_STORAGE_KEY = "m3-tokens";

/**
 * Reproduced from  https://github.com/material-foundation/material-color-utilities/blob/main/typescript/scheme/variant.ts
 * Keep up to date.
 *
 * Set of themes supported by Dynamic Color.
 * Instantiate the corresponding subclass, ex. SchemeTonalSpot, to create
 * colors corresponding to the theme.
 */
export enum Variant {
  MONOCHROME,
  NEUTRAL,
  TONAL_SPOT,
  VIBRANT,
  EXPRESSIVE,
  FIDELITY,
  CONTENT,
  RAINBOW,
  FRUIT_SALAD,
}

export interface TokensContextType {
  tokens: M3ColorTokens;
  generate: (base: string | HTMLImageElement) => Promise<void>;
  reset: () => void;
}

export const TokensContext = createContext<TokensContextType>({
  tokens: DEFAULT_TOKENS,
  generate() {
    throw new Error("A provider for TokensContext is not in context.");
  },
  reset() {
    throw new Error("A provider for TokensContext is not in context.");
  },
});

interface TokensProviderProps {
  children: ReactNode;
}

export default function TokensProvider({ children }: TokensProviderProps) {
  const [tokens, setTokens] = useState<M3ColorTokens>(DEFAULT_TOKENS);

  useEffect(() => {
    const keyContents = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (keyContents) {
      const localStorageTokens = JSON.parse(
        keyContents
        // If the user tampers with LocalStorage, it's UB.
        // So, sorry for the cast.
      ) as M3ColorTokens;
      setTokens(localStorageTokens);
    }
  }, []);

  const tokensValue = useMemo<TokensContextType>(
    () => ({
      tokens,
      async generate(base: string | HTMLImageElement) {
        const newTokens = await generateTokens(base);
        setTokens(newTokens);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTokens));
      },
      reset() {
        setTokens(DEFAULT_TOKENS);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_TOKENS));
      },
    }),
    [tokens]
  );

  return (
    <TokensContext.Provider value={tokensValue}>
      {children}
    </TokensContext.Provider>
  );
}
