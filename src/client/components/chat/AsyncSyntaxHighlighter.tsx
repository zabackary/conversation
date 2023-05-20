/* eslint-disable react/jsx-props-no-spreading */
import { ComponentType, Suspense, lazy } from "react";
import { PrismLight, SyntaxHighlighterProps } from "react-syntax-highlighter";

const Prism = lazy(() =>
  import(`https://esm.sh/react-syntax-highlighter@15?bundle&exports=${"Prism"}`)
    .then((exports) => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      default: exports.Prism as ComponentType<SyntaxHighlighterProps>,
    }))
    .catch((e) => {
      console.warn("Failed to load react-syntax-highlighter:", e);
      throw e;
    })
);

export default function AsyncSyntaxHighlighter(props: SyntaxHighlighterProps) {
  return (
    <Suspense fallback={<PrismLight {...props} />}>
      <Prism {...props} />
    </Suspense>
  );
}
