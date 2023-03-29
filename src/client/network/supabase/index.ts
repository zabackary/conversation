import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../@types/supabase";
import Channel, {
  DmChannel,
  PublicChannelListing,
} from "../../../model/channel";
import User, { NewUserMetadata, UserId } from "../../../model/user";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
  Subscribable,
} from "../network_definitions";
import { createSubscribable, mapSubscribable } from "../utils";
import SupabaseCache from "./cache";
import convertChannel from "./converters/convertChannel";
import convertUser from "./converters/convertUser";
import getLoggedInUserSubscribable from "./getLoggedInUserSubscribable";
import getChannel from "./getters/getChannel";
import getChannels from "./getters/getChannels";
import getUser from "./getters/getUser";
import SupabaseChannelBackend from "./SupabaseChannelBackend";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZW5uZXVzZWFobmNham1rY29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzkwNDUyMzksImV4cCI6MTk5NDYyMTIzOX0.HPV_5uNAtMRSosgccOpLzrviqehiS99N7Mf8GGRJHB8";

export default class SupabaseBackend implements NetworkBackend {
  client = createClient<Database>(
    "https://pcenneuseahncajmkcoe.supabase.co/",
    SUPABASE_ANON_KEY
  );

  cache = new SupabaseCache();

  loggedInUserSubscribable: Subscribable<User>;

  constructor() {
    this.loggedInUserSubscribable = getLoggedInUserSubscribable(this.client);
  }

  async authLogIn(email: string, password: string): Promise<void> {
    const { error } = await this.client.auth.signInWithPassword({
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
    const { error } = await this.client.auth.signUp({
      email: newUser.email,
      password,
    });
    if (error) throw error;
  }

  getUser(id?: string): Subscribable<User> {
    if (id === undefined) {
      return this.loggedInUserSubscribable;
    }
    return createSubscribable(async (next) => {
      next(convertUser(await getUser(this.client, id)));
    });
  }

  getUserActivity(_user: UserId): Subscribable<boolean | null> {
    return createSubscribable((_next) => {
      // TODO: Implement
    });
  }

  getDMs(): Subscribable<DmChannel[]> {
    return mapSubscribable(this.loggedInUserSubscribable, async (value) => {
      if (value instanceof Error) {
        return value;
      }
      const channels = await getChannels(this.client, false);
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
    _info: JoinInfo
  ): Promise<string | null> {
    throw new Error("Method not implemented.");
  }

  getChannels(): Subscribable<Channel[]> {
    return mapSubscribable(this.loggedInUserSubscribable, async (value) => {
      if (value instanceof Error) {
        return value;
      }
      const channels = await getChannels(this.client);
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
      if (user instanceof Error || user === null) {
        reject(new Error("Not logged in; can't start channel."));
        return;
      }
      const currentId = user.id;
      if (typeof currentId === "number") throw new Error("Id is number");
      resolve(new SupabaseChannelBackend(id, currentId, this, this.client));
    });
  }

  getChannel(id: number): Subscribable<Channel | null> {
    return createSubscribable(async (next) => {
      next(
        convertChannel(
          await this.cache.getChannelOrFallback(id, () =>
            getChannel(this.client, id)
          )
        )
      );
    });
  }
}
