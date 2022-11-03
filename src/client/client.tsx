import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import App from "./App";
import Chat from "./components/chat/Chat";
import { RouteErrorPage } from "./components/error/error";
import { createGasHashRouter } from "./router/gasHashRouter";

document.body.style.margin = "0";
const container = document.createElement("div");
document.body.appendChild(container);

const router = createGasHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: "channels/:channelId",
        element: <Chat />,
      },
    ],
  },
]);

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
