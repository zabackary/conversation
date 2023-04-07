import { createContext } from "react";
import NetworkBackend from "../network/NetworkBackend";

const BackendContext = createContext<NetworkBackend | null>(null);
export default BackendContext;
