import { UserId } from "../../model/user";
import useBackendFunction from "./useBackendFunction";

export default function useUserInfo(
  userId: UserId,
  navigateToLoginOnAuthFailure = true
) {
  return useBackendFunction(
    (backend) => backend.getUser(userId),
    navigateToLoginOnAuthFailure
  );
}
