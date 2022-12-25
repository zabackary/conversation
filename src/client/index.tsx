import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/error";

document.documentElement.lang = "en-US";
document.documentElement.style.height = "100%";
document.body.style.margin = "0";
document.body.style.height = "100%";
document.body.style.setProperty("-webkit-tap-highlight-color", "transparent");
const container = document.createElement("div");
container.style.height = "100%";
document.body.appendChild(container);

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
