import { ReactNode, useMemo } from "react";
import DefaultBackend from "../network/default_backend";
import BackendContext from "./BackendContext";

export interface BackendContextProviderProps {
  children?: ReactNode;
}
export default function BackendContextProvider({
  children,
}: BackendContextProviderProps) {
  const backend = useMemo(() => new DefaultBackend(), []);
  return (
    <BackendContext.Provider value={backend}>
      {children}
    </BackendContext.Provider>
  );
}
