import { AuthChangeEvent, createClient, Session } from "@supabase/supabase-js";
import { Database } from "../../../@types/supabase";
import Channel, {
  DmChannel,
  PublicChannelListing,
} from "../../../model/channel";
import User, { NewUserMetadata, PrivilegeLevel } from "../../../model/user";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
  LoggedOutException,
  Subscribable,
} from "../network_definitions";
import { createSubscribable, mapSubscribable } from "../utils";
import SupabaseCache from "./cache";
import convertChannel from "./converters/convertChannel";
import convertUser from "./converters/convertUser";
import getChannel from "./getters/getChannel";
import getChannels from "./getters/getChannels";
import getUser from "./getters/getUser";
import SupabaseChannelBackend from "./SupabaseChannelBackend";

const supabase = createClient<Database>(
  "https://pcenneuseahncajmkcoe.supabase.co/",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZW5uZXVzZWFobmNham1rY29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzkwNDUyMzksImV4cCI6MTk5NDYyMTIzOX0.HPV_5uNAtMRSosgccOpLzrviqehiS99N7Mf8GGRJHB8"
);

let userId: string | undefined;

const userSubscribable = createSubscribable<User>(async (next) => {
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
        const { data: userMetadatas } = await supabase
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
            await supabase.from("users").insert({
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
  } = await supabase.auth.getSession();
  await handleAuthChanged(
    currentSession ? "SIGNED_IN" : "SIGNED_OUT",
    currentSession
  );
  supabase.auth.onAuthStateChange((...args) => {
    void handleAuthChanged(...args);
  });
});

export default class SupabaseBackend implements NetworkBackend {
  cache = new SupabaseCache();

  async authLogIn(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  authLogOut(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async authCreateAccount(
    newUser: NewUserMetadata,
    password: string
  ): Promise<void> {
    const { error } = await supabase.auth.signUp({
      email: newUser.email,
      password,
    });
    if (error) throw error;
  }

  getUser(id?: string): Subscribable<User> {
    if (id === undefined) {
      return userSubscribable;
    }
    return createSubscribable(async (next) => {
      next(convertUser(await getUser(supabase, id)));
    });
  }

  getUserActivity(user: string): Subscribable<boolean | null> {
    throw new Error("Method not implemented.");
  }

  getDMs(): Subscribable<DmChannel[]> {
    return mapSubscribable(userSubscribable, async (value) => {
      if (value instanceof Error) {
        return value;
      }
      const channels = await getChannels(supabase, false);
      this.cache.putChannel(...channels);
      return channels
        .map(convertChannel)
        .filter((channel) => channel.dm) as DmChannel[];
    });
  }

  getPublicChannels(): Subscribable<PublicChannelListing[]> {
    throw new Error("Method not implemented.");
  }

  joinChannel<JoinInfo extends ChannelJoinInfo>(
    info: JoinInfo
  ): Promise<string | null> {
    throw new Error("Method not implemented.");
  }

  getChannels(): Subscribable<Channel[]> {
    return mapSubscribable(userSubscribable, async (value) => {
      if (value instanceof Error) {
        return value;
      }
      const channels = await getChannels(supabase);
      this.cache.putChannel(...channels);
      return channels.map(convertChannel);
    });
  }

  clearCache(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  connectChannel(id: number): Promise<ChannelBackend | null> {
    return new Promise((resolve, reject) => {
      const user = this.getUser().getSnapshot();
      if (user instanceof Error || user === null)
        throw new Error("Not logged in; can't start channel");
      const currentId = user.id;
      if (typeof currentId === "number") throw new Error("Id is number");
      resolve(new SupabaseChannelBackend(id, currentId, this, supabase));
    });
  }

  getChannel(id: number): Subscribable<Channel | null> {
    return createSubscribable(async (next) => {
      next(
        convertChannel(
          await this.cache.getChannelOrFallback(id, () =>
            getChannel(supabase, id)
          )
        )
      );
    });
  }
}
