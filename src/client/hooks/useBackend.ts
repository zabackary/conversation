import { useContext } from "react";
import BackendContext from "../context/BackendContext";

export default function useBackend() {
  const backend = useContext(BackendContext);
  if (!backend) throw new Error("Cannot find backend in parent tree.");
  return backend;
}
