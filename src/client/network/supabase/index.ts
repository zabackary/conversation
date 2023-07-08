import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import { Database } from "../../../@types/supabase";
import Channel, {
  DmChannel,
  GroupChannel,
  InvitedChannelListing,
  PrivacyLevel,
  PublicChannelListing,
} from "../../../model/channel";
import Message from "../../../model/message";
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
  DocumentType,
  Subscribable,
} from "../NetworkBackend";
import QueuedBackend from "../QueuedBackend";
import { DispatchableSubscribable } from "../Subscribable";
import GasBackend from "../gas/GasBackend";
import SupabaseChannelBackend from "./SupabaseChannelBackend";
import SupabaseCache, { SupabaseMessage } from "./cache";
import convertChannel from "./converters/convertChannel";
import convertMessage from "./converters/convertMessage";
import convertUser from "./converters/convertUser";
import getLoggedInUserSubscribable, {
  UserAuthStatus,
} from "./getLoggedInUserSubscribable";
import getChannel from "./getters/getChannel";
import getChannels from "./getters/getChannels";
import getMessage from "./getters/getMessage";
import getUser from "./getters/getUser";
import {
  normalizeJoin,
  nullablePromiseFromSubscribable,
  promiseFromSubscribable,
} from "./utils";

class SupabaseBackendImpl implements NetworkBackend {
  client = createClient<Database>(
    import.meta.env.CLIENT_SUPABASE_URL ?? "",
    import.meta.env.CLIENT_SUPABASE_ANON_KEY ?? ""
  );

  private cache = new SupabaseCache();

  private loggedInUserSubscribable!: Subscribable<RegisteredUser | null>;

  isReady: Promise<void>;

  private realtimeChannel: RealtimeChannel;

  messageSubscribable: Subscribable<Message | null>;

  connectionState: Subscribable<
    "connecting" | "connected" | "reconnecting" | "error"
  >;

  attributes = new DispatchableSubscribable({
    recovery: false,
    onboarding: false,
  });

  private gasBackend = new GasBackend();

  private lastUserId: string | undefined;

  private initializeLoggedInUserSubscribable() {
    this.loggedInUserSubscribable = getLoggedInUserSubscribable(
      this.client,
      this.cache
    ).mapSync<RegisteredUser | null>((value) => {
      if (value.id) this.lastUserId = value.id;
      if (value.status === UserAuthStatus.NEEDS_ONBOARDING) {
        this.attributes.dispatch({
          recovery: false,
          onboarding: true,
        });
        return null;
      }
      if (value.status === UserAuthStatus.PASSWORD_RECOVERY) {
        this.attributes.dispatch({
          recovery: true,
          onboarding: false,
        });
        return value.user ?? null;
      }
      this.attributes.dispatch({
        recovery: false,
        onboarding: false,
      });
      return value.user ?? null;
    });
  }

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
    this.initializeLoggedInUserSubscribable();
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
          const message = payload.new as SupabaseMessage;
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

  async setUserDetails(
    details: Pick<RegisteredUser, "name" | "nickname" | "profilePicture">
  ): Promise<void> {
    if (!this.lastUserId)
      throw new Error("Can't find logged in user to set details of");
    const { error } = await this.client.from("users").upsert({
      name: details.name,
      id: this.lastUserId,
      is_bot: false,
      nickname: details.nickname ?? "",
      verified: false,
    });
    if (error) throw error;
    // Force refresh of user object
    this.initializeLoggedInUserSubscribable();
  }

  async acceptInvite(id: number): Promise<void> {
    const userId = this.getCurrentSession().getSnapshot()?.id;
    if (!userId) throw new Error("Must be logged in to accept invites");
    const channel = (
      await this.cache.getChannelOrFallback(id, () =>
        getChannel(this.client, this.cache, id)
      )
    ).getSnapshot();
    let success = false;
    if (channel.privacy_level === 0) {
      // Insert a new row; channel is public and no invite (this may fail)
      const { error: insertError } = await this.client.from("members").insert({
        user_id: userId as string,
        channel_id: id,
        accepted: true,
      });
      if (!insertError) {
        success = true;
      }
    }
    if (!success) {
      const { error: updateError } = await this.client
        .from("members")
        .update({
          user_id: userId as string,
          channel_id: id,
          accepted: true,
          actor: null,
          invite_message: null,
        })
        .eq("channel_id", id)
        .eq("user_id", userId);
      if (updateError) {
        throw updateError;
      } else {
        success = true;
      }
    }
    const currentChannelList = await this.cache.getChannelListOrFallback(() =>
      getChannels(this.client, this.cache, userId as string)
    );
    this.cache.putChannelList(
      currentChannelList
        .getSnapshot()
        .concat([
          (
            await this.cache.getChannelOrFallback(id, () =>
              getChannel(this.client, this.cache, id)
            )
          ).getSnapshot(),
        ])
    );
  }

  async deleteInvite(id: number): Promise<void> {
    const userId = this.getCurrentSession().getSnapshot()?.id;
    if (!userId) throw new Error("Must be logged in to delete invites");
    const { error } = await this.client
      .from("members")
      .delete()
      .eq("channel_id", id)
      .eq("user_id", userId)
      .eq("accepted", false);
    if (error) throw error;
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
        "invite_message, actor, channels!channel_id(description, id, name, owner, is_dm)"
      )
      .eq("accepted", false)
      .eq("user_id", user.id as string)
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return data.map((dbMember) => {
      const channel = normalizeJoin(dbMember.channels)[0];
      if (!channel) throw new Error("Could not get channel for invite");
      return {
        actor: dbMember.actor ?? undefined,
        description: channel.description ?? "",
        id: channel.id,
        inviteMessage: dbMember.invite_message ?? "",
        name: channel.name ?? "",
        owner: channel.owner,
        dm: channel.is_dm,
      };
    });
  }

  async getPublicChannels(
    offset: number,
    limit: number
  ): Promise<PublicChannelListing[]> {
    const user = this.getCurrentSession().getSnapshot();
    if (!user) throw new Error("Must be logged in to get public channels.");
    const currentChannels = await this.getChannels().next();
    if (!currentChannels) throw new Error("Must be logged in.");
    const { data, error } = await this.client
      .from("channels")
      .select("id, name, description, owner")
      .eq("privacy_level", 0)
      .not(
        "id",
        "in",
        // TODO: According to https://github.com/orgs/supabase/discussions/2055#discussioncomment-923451
        // there's a PostgREST-js bug, so need to do formatting myself.
        `(${currentChannels.map((channel) => channel.id).join(", ")})`
      )
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
    const currentUser = this.getCurrentSession().getSnapshot();
    if (!currentUser) throw new Error("Must be logged in to remove members");
    if (canRejoin) {
      // "Unaccept" the invite by which the members joined by.
      const { error } = await this.client
        .from("members")
        .update({
          accepted: false,
          invite_message: null,
        })
        .in("user_id", userIds as string[])
        .eq("channel_id", id);
      if (error) throw error;
    } else {
      // Delete the members, permanently.
      const { error } = await this.client
        .from("members")
        .delete()
        .in("user_id", userIds as string[])
        .eq("channel_id", id);
      if (error) throw error;
    }
    if (userIds.includes(currentUser.id)) {
      const channelList = await this.cache.getChannelListOrFallback(() =>
        getChannels(this.client, this.cache, currentUser.id as string)
      );
      this.cache.putChannelList(
        channelList.getSnapshot().filter((channel) => channel.id !== id)
      );
    }
  }

  generateLink(id: number): Promise<string> {
    throw new Error(`Cannot generate link for ${id}: method not implemented.`);
  }

  async updateChannel(
    id: number,
    details: Partial<ChannelDetails>
  ): Promise<void> {
    const { data, error } = await this.client
      .from("channels")
      .update({
        members_can_edit: details.membersCanEdit,
        description: details.description,
        name: details.name,
        privacy_level: details.privacyLevel,
      })
      .eq("id", id)
      .select("*, users!members ( * )")
      .single();
    if (error) throw error;
    this.cache.putChannel({
      ...data,
      users: normalizeJoin(data.users),
    });
  }

  async deleteChannel(id: number): Promise<void> {
    const user = this.loggedInUserSubscribable.getSnapshot();
    if (user === null || user instanceof Error)
      throw new Error("Loading or signing in.");
    const { error } = await this.client.from("channels").delete().eq("id", id);
    if (error) throw error;
    const currentChannelList = await this.cache.getChannelListOrFallback(() =>
      getChannels(this.client, this.cache, user.id as string)
    );
    this.cache.putChannelList(
      currentChannelList.getSnapshot().filter((channel) => channel.id !== id)
    );
  }

  /**
   * Create a channel
   * @param name The name of the channel
   * @param description The description
   * @param privacyLevel self-explanatory
   * @param password guess...
   * @returns a promise for your love
   */
  createChannel(
    name: string,
    description: string,
    privacyLevel: PrivacyLevel,
    password?: string
  ): Promise<Channel>;

  /**
   * Creates a channel with more options.
   *
   * @internal
   *
   * @param name The name of the channel
   * @param description The description
   * @param privacyLevel Privacy level
   * @param password Password
   * @param isDm Whether the channel is a DM
   * @param initialMembers The members the channel should start out with
   * That doesn't mean the members are in; they may need to accept invites.
   */
  createChannel(
    name: string | null,
    description: string | null,
    privacyLevel: PrivacyLevel,
    password: string | undefined,
    isDm: boolean,
    initialMembers: string[]
  ): Promise<Channel>;

  async createChannel(
    name: string | null,
    description: string | null,
    privacyLevel: PrivacyLevel,
    password?: string | undefined,
    isDm = false,
    initialMembers: string[] = []
  ): Promise<Channel> {
    const user = this.loggedInUserSubscribable.getSnapshot();
    if (user === null || user instanceof Error)
      throw new Error("Loading or signing in.");
    const userId = user.id as string;
    const { data, error } = await this.client
      .from("channels")
      .insert({
        is_dm: isDm,
        owner: userId,
        privacy_level: privacyLevel,
        description,
        name,
        password,
      })
      .select();
    if (error) throw error;
    const [dbChannel] = data;
    if (!dbChannel) throw new Error("Could not get channel ID");
    const { error: memberError } = await this.client.from("members").insert(
      [userId, ...initialMembers].map((id) => ({
        accepted: userId === id,
        channel_id: dbChannel.id,
        user_id: id,
      }))
    );
    if (memberError) {
      console.warn("Attempting rollback of channel creation...");
      const { error: rollbackError } = await this.client
        .from("channels")
        .delete()
        .eq("id", dbChannel.id)
        .single();
      if (rollbackError)
        console.error("Failed to rollback channel creation:", rollbackError);
      throw memberError;
    }
    const channel = {
      ...dbChannel,
      users: [
        (
          await this.cache.getUserOrFallback(userId, () =>
            getUser(this.client, this.cache, userId)
          )
        ).getSnapshot(),
        ...(await Promise.all(
          initialMembers.map((memberId) =>
            getUser(this.client, this.cache, memberId)
          )
        )),
      ],
    };
    this.cache.putChannel(channel);
    const currentChannelList = await this.cache.getChannelListOrFallback(() =>
      getChannels(this.client, this.cache, user.id as string)
    );
    this.cache.putChannelList(
      currentChannelList.getSnapshot().concat([channel])
    );
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
    this.cache.clearUserDependentState();
  }

  async authCreateAccount(
    newUser: NewUserMetadata,
    password: string
  ): Promise<void> {
    const { error } = await this.client.auth.signUp({
      email: newUser.email,
      password,
      options: {
        emailRedirectTo: `${APP_CONFIG.baseURL}/account_setup/`,
      },
    });
    if (error) throw error;
  }

  getCurrentSession() {
    return this.loggedInUserSubscribable;
  }

  getUser(id: string): Subscribable<User | null> {
    return new Subscribable<User | null>(async (next, nextError) => {
      (
        await this.cache.getUserOrFallback(id, () =>
          getUser(this.client, this.cache, id)
        )
      )
        .map<User | null>((user) => Promise.resolve(convertUser(user)), null)
        .subscribe(({ value, error }) => {
          if (error) nextError(error);
          else next(value);
        });
    }, null);
  }

  getMessage(id: number): Subscribable<Message | null> {
    return new Subscribable<Message | null>(async (next, nextError) => {
      (
        await this.cache.getMessageOrFallback(id, () =>
          getMessage(this.client, this.cache, id)
        )
      )
        .map<Message | null>(
          (message) =>
            Promise.resolve(
              convertMessage(message, (userId) =>
                promiseFromSubscribable(this.getUser(userId))
              )
            ),
          null
        )
        .subscribe(({ value, error }) => {
          if (error) nextError(error);
          else next(value);
        });
    }, null);
  }

  getUserActivity(_user: UserId): Subscribable<boolean | null> {
    return new Subscribable<boolean | null>((_next, _nextError) => {
      // TODO: Implement using the channel.
    }, false);
  }

  getDMs(): Subscribable<DmChannel[] | null> {
    return new Subscribable<DmChannel[] | null>(async (next, nextError) => {
      (
        await this.cache.getChannelListOrFallback(() => {
          const id = this.getCurrentSession().getSnapshot()?.id;
          return id
            ? getChannels(this.client, this.cache, id as string)
            : Promise.resolve([]);
        })
      )
        .map<DmChannel[] | null>(
          (channels) =>
            Promise.resolve(
              channels
                .map((channel) => convertChannel(channel))
                .filter<DmChannel>(
                  (channel): channel is DmChannel => channel.dm
                )
            ),
          null
        )
        .subscribe(({ value, error }) => {
          if (error) nextError(error);
          else next(value);
        });
    }, null);
  }

  async openDM(user: UserId): Promise<number> {
    // This relies on the fact that users can't see the channels they're not
    // part of, because of RLS. If the row-level security fails, this will fail
    // along with it.
    const { data, error } = await this.client
      .from("members")
      .select("channels(id)")
      .eq("user_id", user)
      .eq("channels.is_dm", true);
    if (error) throw error;
    // Find a member attached to a valid DM (array is for extra-safe types)
    const candidate = data.find(
      (member) => normalizeJoin(member.channels).length > 0
    );
    if (candidate) {
      // Yay, found the channel. Return it.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return normalizeJoin(candidate.channels)[0]!.id;
    }
    return (
      await this.createChannel(
        null,
        null,
        PrivacyLevel.PRIVATE,
        undefined,
        true,
        [user as string]
      )
    ).id;
  }

  joinChannel<JoinInfo extends ChannelJoinInfo>(
    _info: JoinInfo
  ): Promise<string | null> {
    throw new Error("Method not implemented.");
  }

  getChannels(): Subscribable<Channel[] | null> {
    return new Subscribable<Channel[] | null>(async (next, nextError) => {
      (
        await this.cache.getChannelListOrFallback(() => {
          const id = this.getCurrentSession().getSnapshot()?.id;
          return id
            ? getChannels(this.client, this.cache, id as string)
            : Promise.resolve([]);
        })
      )
        .map<GroupChannel[] | null>(
          (channels) =>
            Promise.resolve(
              channels
                .map((channel) => convertChannel(channel))
                .filter<GroupChannel>(
                  (channel): channel is GroupChannel => !channel.dm
                )
            ),
          null
        )
        .subscribe(({ value, error }) => {
          if (error) nextError(error);
          else next(value);
        });
    }, null);
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
          resolve(
            new SupabaseChannelBackend(
              value.id,
              currentUserId,
              this,
              this.cache
            )
          );
          unsubscribe();
        } else resolve(null);
      });
    });
  }

  getChannel(id: number): Subscribable<Channel | null> {
    return new Subscribable<Channel | null>(async (next, nextError) => {
      (
        await this.cache.getChannelOrFallback(id, () =>
          getChannel(this.client, this.cache, id)
        )
      )
        .map<Channel | null>(
          (user) => Promise.resolve(convertChannel(user)),
          null
        )
        .subscribe(({ value, error }) => {
          if (error) nextError(error);
          else next(value);
        });
    }, null);
  }

  /**
   * Search users.
   *
   * > *⚠ WARNING*
   * >
   * > This function is **EXPENSIVE** to call and should be debounced at least
   * > one second!
   *
   * @param query The query.
   */
  async searchUsers(query: string): Promise<User[]> {
    const { data, error } = await this.client
      .from("users")
      .select("*")
      .or(
        `name.ilike.*${encodeURIComponent(
          query
        )}*,nickname.ilike.*${encodeURIComponent(
          query
        )}*,email.ilike.*${encodeURIComponent(query)}*`
      )
      .limit(5);
    if (error) throw error;
    this.cache.putUser(...data);
    return data.map(convertUser);
  }

  getDocument(documentType: DocumentType): Promise<string> {
    return this.gasBackend.getDocument(documentType);
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
