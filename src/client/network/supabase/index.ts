import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import { Database } from "../../../@types/supabase";
import Channel, {
  DmChannel,
  PublicChannelListing,
} from "../../../model/channel";
import User, { NewUserMetadata, UserId } from "../../../model/user";
import { isGASWebApp, updatedHash } from "../../hooks/useRouteForward";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
  LoggedOutException,
  Subscribable,
} from "../NetworkBackend";
import QueuedBackend from "../QueuedBackend";
import {
  createDispatchableSubscribable,
  createSubscribable,
  mapSubscribable,
} from "../utils";
import SupabaseChannelBackend from "./SupabaseChannelBackend";
import SupabaseCache, { SupabaseMessage } from "./cache";
import convertChannel from "./converters/convertChannel";
import convertUser from "./converters/convertUser";
import getLoggedInUserSubscribable from "./getLoggedInUserSubscribable";
import getChannel from "./getters/getChannel";
import getChannels from "./getters/getChannels";
import getUser from "./getters/getUser";
import { promiseFromSubscribable } from "./utils";
import Message from "../../../model/message";
import getMessage from "./getters/getMessage";
import convertMessage from "./converters/convertMessage";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZW5uZXVzZWFobmNham1rY29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzkwNDUyMzksImV4cCI6MTk5NDYyMTIzOX0.HPV_5uNAtMRSosgccOpLzrviqehiS99N7Mf8GGRJHB8";

class SupabaseBackendImpl implements NetworkBackend {
  client = createClient<Database>(
    "https://pcenneuseahncajmkcoe.supabase.co/",
    SUPABASE_ANON_KEY
  );

  cache = new SupabaseCache();

  loggedInUserSubscribable: Subscribable<User>;

  isReady: Promise<void>;

  realtimeChannel: RealtimeChannel;

  messageSubscribable: Subscribable<Message>;

  constructor() {
    this.loggedInUserSubscribable = getLoggedInUserSubscribable(
      this.client,
      this.cache
    );
    this.isReady = new Promise((resolve, reject) => {
      this.client.auth
        .initialize()
        .then(() => promiseFromSubscribable(this.getUser()))
        .catch((reason) => {
          if (!(reason instanceof LoggedOutException)) throw reason;
        })
        .then(() => resolve())
        .catch(reject);
    });
    this.realtimeChannel = this.client.channel("default");
    const dispatchableMessageSubscribable =
      createDispatchableSubscribable<Message>();
    this.messageSubscribable = dispatchableMessageSubscribable.value;
    this.realtimeChannel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
      },
      (payload) => {
        void (async () => {
          const replyingTo = payload.new.replying_to as number | null;
          const message = {
            ...payload.new,
            replying_to:
              replyingTo !== null
                ? await this.cache.getMessageOrFallback(replyingTo, () =>
                    getMessage(this.client, replyingTo)
                  )
                : null,
          } as SupabaseMessage;
          this.cache.putMessage(message);
          const convertedMessage = await convertMessage(message, (id) =>
            promiseFromSubscribable(this.getUser(id))
          );
          dispatchableMessageSubscribable.dispatch(convertedMessage);
        })();
      }
    );
    this.realtimeChannel.subscribe((status) => {
      if (status !== "SUBSCRIBED") {
        console.error("Failed to open the Realtime channel:", status);
      }
    });
  }

  async authLogIn(email: string, password: string): Promise<void> {
    const { error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async authLogOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
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
      next(
        convertUser(
          await this.cache.getUserOrFallback(id, () => getUser(this.client, id))
        )
      );
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
      const channels = await getChannels(
        this.client,
        value.id as string,
        false
      );
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
      const channels = await getChannels(this.client, value.id as string);
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
      const currentUserId = user.id;
      if (typeof currentUserId === "number") throw new Error("Id is number");
      resolve(new SupabaseChannelBackend(id, currentUserId, this));
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

export type SupabaseBackend = SupabaseBackendImpl;

function SupabaseBackendConstructor() {
  const queuedBackend = new QueuedBackend();
  if (isGASWebApp) {
    void updatedHash.then(() => {
      const supabaseBackend = new SupabaseBackendImpl();
      void supabaseBackend.isReady.then(() => {
        queuedBackend.routeTo(supabaseBackend);
      });
    });
  } else {
    const supabaseBackend = new SupabaseBackendImpl();
    void supabaseBackend.isReady.then(() => {
      queuedBackend.routeTo(supabaseBackend);
    });
  }
  return queuedBackend;
}

export default SupabaseBackendConstructor as unknown as {
  new (): NetworkBackend;
};
