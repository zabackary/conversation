import useBackendFunction from "./useBackendFunction";

export default function useUser(navigateToLoginOnAuthFailure = true) {
  return useBackendFunction(
    (backend) => backend.getCurrentSession(),
    navigateToLoginOnAuthFailure,
    true
  );
}
