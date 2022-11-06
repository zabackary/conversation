import { createContext } from "react";
import DefaultBackend from "./network/default_backend";

const BackendContext = createContext(new DefaultBackend());
export default BackendContext;
