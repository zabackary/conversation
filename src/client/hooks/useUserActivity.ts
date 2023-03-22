import { UserId } from "../../model/user";
import useBackendFunction from "./useBackendFunction";

export default function useUser(
  userId: UserId,
  navigateToLoginOnAuthFailure = true
) {
  return useBackendFunction(
    (backend) => backend.getUserActivity(userId),
    navigateToLoginOnAuthFailure
  );
}
