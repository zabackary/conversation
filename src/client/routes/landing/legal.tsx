import { Typography } from "@mui/material";
import { useCallback } from "react";
import useBackend from "../../hooks/useBackend";
import usePromise from "../../hooks/usePromise";
import { DocumentType } from "../../network/NetworkBackend";

export default function LegalRoute() {
  const backend = useBackend();
  const getPrivacyPolicy = useCallback(() => {
    return backend.getDocument(DocumentType.PRIVACY_POLICY);
  }, [backend]);
  const privacyPolicy = usePromise(getPrivacyPolicy);
  return <Typography>{privacyPolicy}</Typography>;
}
