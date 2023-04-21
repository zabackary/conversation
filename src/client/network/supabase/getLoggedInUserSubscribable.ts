import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { PrivilegeLevel, RegisteredUser } from "../../../model/user";
import { Subscribable } from "../NetworkBackend";
import { ConversationSupabaseClient } from "./utils";
import SupabaseCache from "./cache";
import getUser from "./getters/getUser";
import convertUser from "./converters/convertUser";

export default function getLoggedInUserSubscribable(
  client: ConversationSupabaseClient,
  cache: SupabaseCache
) {
  return new Subscribable<RegisteredUser | null>(async (next) => {
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
        case "SIGNED_IN": {
          if (!newSession) throw new Error("Signed in w/o session");
          if (userId === newSession.user.id) return;
          userId = newSession.user.id;
          let userMetadata;
          try {
            userMetadata = await cache.getUserOrFallback(userId, () =>
              getUser(client, userId)
            );
          } catch (e) {
            // Noop
          }
          if (!userMetadata) {
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
            }
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
