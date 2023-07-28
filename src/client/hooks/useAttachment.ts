import useBackendFunction from "./useBackendFunction";

export default function useAttachment(
  id: string,
  navigateToLoginOnAuthFailure = true
) {
  return useBackendFunction(
    (backend) => backend.getAttachment(id),
    navigateToLoginOnAuthFailure
  );
}
