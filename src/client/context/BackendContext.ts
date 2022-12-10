import { createContext } from "react";
import NetworkBackend from "../network/network_definitions";

const BackendContext = createContext<NetworkBackend | null>(null);
export default BackendContext;
