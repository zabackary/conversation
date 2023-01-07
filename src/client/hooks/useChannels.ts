import useBackendFunction from "./useBackendFunction";

export default function useChannels(navigateToLoginOnAuthFailure = true) {
  return useBackendFunction(
    (backend) => backend.getChannels(),
    navigateToLoginOnAuthFailure
  );
}
