import useBackendFunction from "./useBackendFunction";

export default function useUser(navigateToLoginOnAuthFailure = true) {
  return useBackendFunction(
    (backend) => backend.getUser(),
    navigateToLoginOnAuthFailure,
    true
  );
}
