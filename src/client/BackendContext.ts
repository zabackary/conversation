import { createContext } from "react";
import type DefaultBackend from "./network/default_backend";

const BackendContext = createContext<DefaultBackend | null>(null);
export default BackendContext;
