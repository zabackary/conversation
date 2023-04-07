import { ReactNode, useState } from "react";
import CachedBackend from "../network/CachedBackend";
import DefaultBackend from "../network/default_backend";
import BackendContext from "./BackendContext";

export interface BackendContextProviderProps {
  children?: ReactNode;
}
export default function BackendContextProvider({
  children,
}: BackendContextProviderProps) {
  const [backend] = useState(() => new CachedBackend(new DefaultBackend()));
  return (
    <BackendContext.Provider value={backend}>
      {children}
    </BackendContext.Provider>
  );
}
