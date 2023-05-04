import useBackendFunction from "./useBackendFunction";

export default function useMessage(
  id: number,
  navigateToLoginOnAuthFailure = true
) {
  return useBackendFunction(
    (backend) => backend.getMessage(id),
    navigateToLoginOnAuthFailure
  );
}
