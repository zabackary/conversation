import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import User, { PrivilegeLevel } from "../../../model/user";
import { LoggedOutException } from "../NetworkBackend";
import { createSubscribable } from "../utils";
import { ConversationSupabaseClient } from "./utils";

export default function getLoggedInUserSubscribable(
  client: ConversationSupabaseClient
) {
  return createSubscribable<User>(async (next) => {
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
          const { data: userMetadatas } = await client
            .from("users")
            .select()
            .eq("id", newSession.user.id)
            .limit(1);
          const userMetadata = userMetadatas?.[0];
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
                trusted: false,
                banner_url: null,
                profile_picture_url: profilePicture,
              });
            }
          } else {
            next({
              ...newSession.user,
              email: newSession.user.email ?? "",
              name: userMetadata.name,
              nickname: userMetadata.nickname,
              privilegeLevel: userMetadata.trusted
                ? PrivilegeLevel.Normal
                : PrivilegeLevel.Unverified,
              profilePicture: userMetadata.profile_picture_url ?? undefined,
              active: false,
              banner: userMetadata.banner_url ?? undefined,
              isBot: false,
            });
          }
          userId = newSession.user.id;
          break;
        }
        case "USER_DELETED":
        case "SIGNED_OUT": {
          userId = undefined;
          next(new LoggedOutException());
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
  });
}
