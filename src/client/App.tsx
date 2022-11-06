import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { RouteErrorPage } from "./components/error/error";
import DefaultBackend from "./network/default_backend";
import { createGasHashRouter } from "./router/gasHashRouter";
import Channel from "./routes/home/channel/Channel";
import Home from "./routes/home/Home";

const router = createGasHashRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: "channel/:channelId",
        element: <Channel />,
      },
    ],
  },
]);

export default function App() {
  const [backend, setBackend] = useState(new DefaultBackend());

  return <RouterProvider router={router} />;
}
