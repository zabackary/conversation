import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { RegisteredUser } from "../../../model/user";
import { Subscribable } from "../NetworkBackend";
import SupabaseCache from "./cache";
import convertUser from "./converters/convertUser";
import getUser from "./getters/getUser";
import { ConversationSupabaseClient } from "./utils";

export const NEEDS_ONBOARDING = Symbol("onboarding");
export const PASSWORD_RECOVERY = Symbol("recovery");

export default function getLoggedInUserSubscribable(
  client: ConversationSupabaseClient,
  cache: SupabaseCache
) {
  return new Subscribable<
    RegisteredUser | typeof NEEDS_ONBOARDING | typeof PASSWORD_RECOVERY | null
  >(async (next) => {
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
            next(NEEDS_ONBOARDING);
            /*
            // TODO: Make this good UI
            // eslint-disable-next-line no-restricted-globals
            if (confirm("Let's set up your account.")) {
              const name = prompt("Name?") ?? "";
              const nickname = prompt("Nickname?") ?? "";
              const profilePicture = prompt("Profile picture URL?");
              next({
                ...newSession.user,
                email: newSession.user.email ?? "",
                name,
                nickname,
                privilegeLevel: PrivilegeLevel.Unverified,
                profilePicture: profilePicture ?? undefined,
                active: false,
                banner: undefined,
                isBot: false,
                disabled: false,
              });
              await client.from("users").insert({
                id: newSession.user.id,
                is_bot: false,
                name,
                nickname,
                verified: false,
                banner_url: null,
                profile_picture_url: profilePicture,
              });
            } */
          } else {
            next(convertUser(userMetadata) as RegisteredUser);
          }
          break;
        }
        case "USER_DELETED":
        case "SIGNED_OUT": {
          userId = undefined;
          next(null);
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
  }, null);
}
