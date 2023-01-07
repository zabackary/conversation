import useBackendFunction from "./useBackendFunction";

export default function useChannel(
  id: number,
  navigateToLoginOnAuthFailure = true
) {
  return useBackendFunction(
    (backend) => backend.getChannel(id),
    navigateToLoginOnAuthFailure
  );
}
