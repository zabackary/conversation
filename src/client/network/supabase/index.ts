import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import { Database } from "../../../@types/supabase";
import Channel, {
  DmChannel,
  InvitedChannelListing,
  PrivacyLevel,
  PublicChannelListing,
} from "../../../model/channel";
import User, {
  NewUserMetadata,
  RegisteredUser,
  UserId,
} from "../../../model/user";
import { isGASWebApp, updatedHash } from "../../hooks/useRouteForward";
import NetworkBackend, {
  ChannelBackend,
  ChannelDetails,
  ChannelJoinInfo,
  Subscribable,
} from "../NetworkBackend";
import QueuedBackend from "../QueuedBackend";
import SupabaseChannelBackend from "./SupabaseChannelBackend";
import SupabaseCache, { SupabaseMessage } from "./cache";
import convertChannel from "./converters/convertChannel";
import convertUser from "./converters/convertUser";
import getLoggedInUserSubscribable from "./getLoggedInUserSubscribable";
import getChannel from "./getters/getChannel";
import getChannels from "./getters/getChannels";
import getUser from "./getters/getUser";
import {
  normalizeJoin,
  nullablePromiseFromSubscribable,
  promiseFromSubscribable,
} from "./utils";
import Message from "../../../model/message";
import getMessage from "./getters/getMessage";
import convertMessage from "./converters/convertMessage";
import { DispatchableSubscribable } from "../Subscribable";
import deletedUser from "./deletedUser";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZW5uZXVzZWFobmNham1rY29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzkwNDUyMzksImV4cCI6MTk5NDYyMTIzOX0.HPV_5uNAtMRSosgccOpLzrviqehiS99N7Mf8GGRJHB8";

class SupabaseBackendImpl implements NetworkBackend {
  client = createClient<Database>(
    "https://pcenneuseahncajmkcoe.supabase.co/",
    SUPABASE_ANON_KEY
  );

  cache = new SupabaseCache();

  loggedInUserSubscribable: Subscribable<RegisteredUser | null>;

  isReady: Promise<void>;

  realtimeChannel: RealtimeChannel;

  messageSubscribable: Subscribable<Message | null>;

  connectionState: Subscribable<
    "connecting" | "connected" | "reconnecting" | "error"
  >;

  constructor() {
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "local"
    ) {
      console.log(
        "Supabase client started initialization. Client is available at window.supabaseClient for debugging since NODE_ENV=development."
      );
      // @ts-ignore This property is write-only and I don't really care about types.
      window.supabaseClient = this.client;
    }
    this.loggedInUserSubscribable = getLoggedInUserSubscribable(
      this.client,
      this.cache
    );
    this.isReady = new Promise((resolve, reject) => {
      this.client.auth
        .initialize()
        .then(() => nullablePromiseFromSubscribable(this.getCurrentSession()))
        .then(() => resolve())
        .catch(reject);
    });
    this.realtimeChannel = this.client.channel("default");
    const dispatchableMessageSubscribable =
      new DispatchableSubscribable<Message | null>(null);
    this.messageSubscribable = dispatchableMessageSubscribable.downgrade();
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
    const dispatchableConnectionState = new DispatchableSubscribable<
      "connecting" | "connected" | "reconnecting" | "error"
    >("connecting");
    this.realtimeChannel.subscribe((status) => {
      if (status !== "SUBSCRIBED")
        console.error("Supabase Realtime error:", status);
      if (status === "CLOSED") {
        dispatchableConnectionState.dispatch("error");
      } else if (status === "TIMED_OUT" || status === "CHANNEL_ERROR") {
        dispatchableConnectionState.dispatch("reconnecting");
      } else {
        dispatchableConnectionState.dispatch("connected");
      }
    });
    this.connectionState = dispatchableConnectionState.downgrade();
  }

  async getInvitedChannels(
    offset: number,
    limit: number
  ): Promise<InvitedChannelListing[]> {
    const user = this.getCurrentSession().getSnapshot();
    if (!user) throw new Error("Must be logged in to get public channels.");
    const { data, error } = await this.client
      .from("members")
      .select(
        "invite_message, actor, channels!channel_id(description, id, name, owner)"
      )
      .eq("accepted", false)
      .eq("user_id", user.id as string)
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return data.map((dbMember) => {
      const channel = normalizeJoin(dbMember.channels)[0];
      return {
        actor: dbMember.actor ?? deletedUser.id,
        description: channel.description ?? "",
        id: channel.id,
        inviteMessage: dbMember.invite_message ?? "",
        name: channel.name ?? "",
        owner: channel.owner,
      };
    });
  }

  async getPublicChannels(
    offset: number,
    limit: number
  ): Promise<PublicChannelListing[]> {
    const user = this.getCurrentSession().getSnapshot();
    if (!user) throw new Error("Must be logged in to get public channels.");
    const { data, error } = await this.client
      .from("channels")
      .select("id, created_at, name, description, owner, members(*)")
      .neq("members.user_id", user.id)
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return data.map((dbChannel) => ({
      description: dbChannel.description ?? "",
      id: dbChannel.id,
      name: dbChannel.name ?? "",
      owner: dbChannel.owner,
    }));
  }

  async addMembers(
    id: number,
    userIds: UserId[],
    invitation: string
  ): Promise<void> {
    const { data, error } = await this.client
      .from("members")
      .insert(
        userIds.map((userId) => ({
          accepted: false,
          channel_id: id,
          user_id: userId as string,
          invite_message: invitation,
        }))
      )
      .select("users!user_id ( * )");
    if (error) throw error;
    data.forEach(({ users }) => {
      this.cache.putUser(...normalizeJoin(users));
    });
    // TODO: Find some way to update the `channel`'s members
  }

  async removeMembers(
    id: number,
    userIds: UserId[],
    canRejoin?: boolean | undefined
  ): Promise<void> {
    if (canRejoin) {
      // "Unaccept" the invite by which the members joined by.
      const { error } = await this.client
        .from("members")
        .update({
          accepted: false,
          invite_message: null,
        })
        .eq("user_id", userIds as string[]);
      if (error) throw error;
    } else {
      // Delete the members, permanently.
      const { error } = await this.client
        .from("members")
        .delete()
        .eq("user_id", userIds);
      if (error) throw error;
    }
  }

  generateLink(id: number): Promise<string> {
    throw new Error(`Cannot generate link for ${id}: method not implemented.`);
  }

  async updateChannel(
    id: number,
    details: Partial<ChannelDetails>
  ): Promise<void> {
    const { error } = await this.client
      .from("channels")
      .update({
        members_can_edit: details.membersCanEdit,
        description: details.description,
        name: details.name,
        privacy_level: details.privacyLevel,
      })
      .eq("id", id)
      .single();
    if (error) throw error;
  }

  async deleteChannel(id: number): Promise<void> {
    const { error } = await this.client.from("channels").delete().eq("id", id);
    if (error) throw error;
  }

  async createChannel(
    name: string,
    description: string,
    privacyLevel: PrivacyLevel,
    password?: string | undefined
  ): Promise<Channel> {
    const user = this.loggedInUserSubscribable.getSnapshot();
    if (user === null || user instanceof Error)
      throw new Error("Loading or signing in.");
    const userId = user.id as string;
    const { data, error } = await this.client
      .from("channels")
      .insert({
        is_dm: false,
        owner: userId,
        privacy_level: privacyLevel,
        description,
        name,
        password,
      })
      .select();
    if (error) throw error;
    const [dbChannel] = data;
    await this.client.from("members").insert({
      accepted: true,
      channel_id: dbChannel.id,
      user_id: userId,
    });
    const channel = {
      ...dbChannel,
      users: [
        await this.cache.getUserOrFallback(userId, () =>
          getUser(this.client, userId)
        ),
      ],
    };
    this.cache.putChannel(channel);
    return convertChannel(channel);
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

  getCurrentSession() {
    return this.loggedInUserSubscribable;
  }

  getUser(id: string): Subscribable<User | null> {
    return new Subscribable<User | null>(async (next) => {
      next(
        convertUser(
          await this.cache.getUserOrFallback(id, () => getUser(this.client, id))
        )
      );
    }, null);
  }

  getUserActivity(_user: UserId): Subscribable<boolean | null> {
    return new Subscribable<boolean | null>((_next, _nextError) => {
      // TODO: Implement using the channel.
    }, false);
  }

  getDMs(): Subscribable<DmChannel[] | null> {
    return this.loggedInUserSubscribable.map<DmChannel[] | null>(
      async (value) => {
        if (!value) return null;
        const channels = await getChannels(
          this.client,
          value.id as string,
          false
        );
        this.cache.putChannel(...channels);
        return channels
          .map(convertChannel)
          .filter((channel) => channel.dm) as DmChannel[];
      },
      null
    );
  }

  joinChannel<JoinInfo extends ChannelJoinInfo>(
    _info: JoinInfo
  ): Promise<string | null> {
    throw new Error("Method not implemented.");
  }

  getChannels(): Subscribable<Channel[] | null> {
    return this.loggedInUserSubscribable.map<Channel[] | null>(
      async (value) => {
        if (!value) return null;
        const channels = await getChannels(this.client, value.id as string);
        this.cache.putChannel(...channels);
        channels.forEach((channel) => {
          this.cache.putUser(...channel.users);
        });
        return channels.map(convertChannel);
      },
      []
    );
  }

  clearCache(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  connectChannel(id: number): Promise<ChannelBackend | null> {
    return new Promise((resolve, reject) => {
      const user = this.getCurrentSession().getSnapshot();
      if (user instanceof Error || user === null) {
        reject(new Error("Not logged in; can't start channel."));
        return;
      }
      const currentUserId = user.id;
      if (typeof currentUserId === "number") throw new Error("Id is number");
      const unsubscribe = this.getChannel(id).subscribe(({ value, error }) => {
        if (!error && value) {
          resolve(new SupabaseChannelBackend(value.id, currentUserId, this));
          unsubscribe();
        } else resolve(null);
      });
    });
  }

  getChannel(id: number): Subscribable<Channel | null> {
    return new Subscribable<Channel | null>(async (next) => {
      try {
        next(
          convertChannel(
            await this.cache.getChannelOrFallback(id, () =>
              getChannel(this.client, id)
            )
          )
        );
      } catch {
        next(null);
      }
    }, null);
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
