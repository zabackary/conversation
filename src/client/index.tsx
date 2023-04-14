import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/error";
import "./i18n";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Cannot find root");
const root = createRoot(rootElement, {});
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
