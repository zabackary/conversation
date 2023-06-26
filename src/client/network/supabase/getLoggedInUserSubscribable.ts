import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { RegisteredUser } from "../../../model/user";
import { Subscribable } from "../NetworkBackend";
import SupabaseCache from "./cache";
import convertUser from "./converters/convertUser";
import getUser from "./getters/getUser";
import { ConversationSupabaseClient } from "./utils";

export enum UserAuthStatus {
  NEEDS_ONBOARDING,
  PASSWORD_RECOVERY,
}

export interface LoggedInUserSubscribableResponse {
  status?: UserAuthStatus;
  user?: RegisteredUser;
  id?: string;
}

export default function getLoggedInUserSubscribable(
  client: ConversationSupabaseClient,
  cache: SupabaseCache
) {
  return new Subscribable<LoggedInUserSubscribableResponse>(async (next) => {
    let userId: string | undefined;
    await new Promise((resolve) => {
      setTimeout(resolve, 1);
    });
    const handleAuthChanged = async (
      event: AuthChangeEvent,
      newSession: Session | null
    ) => {
      switch (event) {
        case "USER_UPDATED":
        case "PASSWORD_RECOVERY":
        case "SIGNED_IN": {
          if (!newSession) throw new Error("Signed in w/o session");
          if (userId === newSession.user.id) return;
          userId = newSession.user.id;
          let userMetadata;
          try {
            userMetadata = (
              await cache.getUserOrFallback(userId, () =>
                getUser(client, cache, userId)
              )
            ).getSnapshot();
          } catch (e) {
            // Noop
          }
          if (!userMetadata) {
            next({
              status: UserAuthStatus.NEEDS_ONBOARDING,
              id: userId,
            });
          } else {
            next({
              status:
                event === "PASSWORD_RECOVERY"
                  ? UserAuthStatus.PASSWORD_RECOVERY
                  : undefined,
              user: convertUser(userMetadata) as RegisteredUser,
              id: userId,
            });
          }
          break;
        }
        case "SIGNED_OUT": {
          userId = undefined;
          next({});
          break;
        }
        default:
          void 0;
      }
    };
    const {
      data: { session: currentSession },
    } = await client.auth.getSession();
    await handleAuthChanged(
      currentSession ? "SIGNED_IN" : "SIGNED_OUT",
      currentSession
    );
    client.auth.onAuthStateChange((...args) => {
      void handleAuthChanged(...args);
    });
  }, {});
}
