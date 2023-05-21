import { Skeleton, Typography } from "@mui/material";
import { useCallback } from "react";
import useBackend from "../hooks/useBackend";
import usePromise from "../hooks/usePromise";
import { DocumentType } from "../network/NetworkBackend";
import MaterialReactMarkdown from "./chat/MaterialReactMarkdown";

export interface DocumentProps {
  documentType: DocumentType;
}

export default function Document({ documentType }: DocumentProps) {
  const backend = useBackend();
  const getDocument = useCallback(() => {
    return backend.getDocument(documentType);
  }, [backend, documentType]);
  const document = usePromise(getDocument);
  if (!document) {
    return (
      <>
        <Typography variant="h1">
          <Skeleton sx={{ maxWidth: 420 }} />
        </Typography>
        <Typography variant="body1">
          <Skeleton />
        </Typography>
        <Typography variant="body1">
          <Skeleton />
        </Typography>
        <Typography variant="h2">
          <Skeleton sx={{ maxWidth: 380 }} />
        </Typography>
        <Typography variant="body1">
          <Skeleton />
        </Typography>
        <Typography variant="body1">
          <Skeleton />
        </Typography>
        <Typography variant="body1">
          <Skeleton />
        </Typography>
        <Typography variant="body1">
          <Skeleton />
        </Typography>
        <Typography variant="h2">
          <Skeleton sx={{ maxWidth: 400 }} />
        </Typography>
        <Typography variant="body1">
          <Skeleton />
        </Typography>
        <Typography variant="body1">
          <Skeleton />
        </Typography>
        <Typography variant="body1">
          <Skeleton />
        </Typography>
      </>
    );
  }
  return <MaterialReactMarkdown>{document}</MaterialReactMarkdown>;
}
