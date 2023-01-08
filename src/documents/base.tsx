import { ReactNode } from "react";

export interface BaseDocumentProps {
  children: ReactNode;
  showDisclaimer?: boolean;
}

export default function BaseDocument({
  children,
  showDisclaimer = true,
}: BaseDocumentProps) {
  return (
    <>
      {showDisclaimer ? (
        <p>
          <i>
            Note: This document is not legal advice and is not legally binding.
            However, please exercise good conscience and follow what you agree
            to.
          </i>
        </p>
      ) : null}
      {children}
    </>
  );
}
