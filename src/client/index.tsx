import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/error";

document.body.style.margin = "0";
document.body.style.setProperty("-webkit-tap-highlight-color", "transparent");
const container = document.createElement("div");
document.body.appendChild(container);

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
