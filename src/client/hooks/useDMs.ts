import useBackendFunction from "./useBackendFunction";

export default function useDMs(navigateToLoginOnAuthFailure = true) {
  return useBackendFunction(
    (backend) => backend.getDMs(),
    navigateToLoginOnAuthFailure
  );
}
