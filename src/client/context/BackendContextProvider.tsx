import { ReactNode, useState } from "react";
import CachedBackend from "../network/CachedBackend";
import DefaultBackend from "../network/DefaultBackend";
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
