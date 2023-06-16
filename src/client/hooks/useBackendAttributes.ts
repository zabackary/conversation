import useBackendFunction from "./useBackendFunction";

export default function useBackendAttributes() {
  return useBackendFunction((backend) => backend.attributes, false);
}
