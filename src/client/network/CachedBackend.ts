/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-return-assign */
import Channel, {
  DmChannel,
  InvitedChannelListing,
  PrivacyLevel,
  PublicChannelListing,
} from "../../model/channel";
import User, {
  NewUserMetadata,
  RegisteredUser,
  UserId,
} from "../../model/user";
import NetworkBackend, {
  ChannelBackend,
  ChannelDetails,
  ChannelJoinInfo,
  Subscribable,
} from "./NetworkBackend";

export default class CachedBackend implements NetworkBackend {
  isReady?: Promise<void>;

  connectionState: Subscribable<
    "connecting" | "connected" | "reconnecting" | "error"
  >;

  constructor(private mirroredBackend: NetworkBackend) {
    this.isReady = mirroredBackend.isReady;
    this.connectionState = mirroredBackend.connectionState;
  }

  getInvitedChannels(
    offset: number,
    limit: number
  ): Promise<InvitedChannelListing[]> {
    return this.mirroredBackend.getInvitedChannels(offset, limit);
  }

  addMembers(id: number, userIds: UserId[], invitation: string): Promise<void> {
    return this.mirroredBackend.addMembers(id, userIds, invitation);
  }

  removeMembers(
    id: number,
    userIds: UserId[],
    canRejoin?: boolean | undefined
  ): Promise<void> {
    return this.mirroredBackend.removeMembers(id, userIds, canRejoin);
  }

  generateLink(id: number): Promise<string> {
    return this.mirroredBackend.generateLink(id);
  }

  updateChannel(id: number, details: Partial<ChannelDetails>): Promise<void> {
    return this.mirroredBackend.updateChannel(id, details);
  }

  deleteChannel(id: number): Promise<void> {
    return this.mirroredBackend.deleteChannel(id);
  }

  createChannel(
    name: string,
    description: string,
    privacyLevel: PrivacyLevel,
    password?: string | undefined
  ): Promise<Channel> {
    return this.mirroredBackend.createChannel(
      name,
      description,
      privacyLevel,
      password
    );
  }

  authLogIn(username: string, password: string): Promise<void> {
    return this.mirroredBackend.authLogIn(username, password);
  }

  authLogOut(): Promise<void> {
    return this.mirroredBackend.authLogOut();
  }

  authCreateAccount(newUser: NewUserMetadata, password: string): Promise<void> {
    return this.mirroredBackend.authCreateAccount(newUser, password);
  }

  currentSessionSubscribable: Subscribable<RegisteredUser | null> | undefined;

  getCurrentSession(): Subscribable<RegisteredUser | null> {
    return (
      this.currentSessionSubscribable ||
      (this.currentSessionSubscribable =
        this.mirroredBackend.getCurrentSession())
    );
  }

  userSubscribableMap: Record<string, Subscribable<User | null>> = {};

  getUser(user: UserId): Subscribable<User | null> {
    return (
      this.userSubscribableMap[user] ||
      (this.userSubscribableMap[user] = this.mirroredBackend.getUser(user))
    );
  }

  statusSubscribableMap: Record<string, Subscribable<boolean | null>> = {};

  getUserActivity(user: UserId): Subscribable<boolean | null> {
    return (
      this.statusSubscribableMap[user] ||
      (this.statusSubscribableMap[user] =
        this.mirroredBackend.getUserActivity(user))
    );
  }

  dmsSubscribable: Subscribable<DmChannel[] | null> | undefined;

  getDMs(): Subscribable<DmChannel[] | null> {
    return (
      this.dmsSubscribable ||
      (this.dmsSubscribable = this.mirroredBackend.getDMs())
    );
  }

  getPublicChannels(
    offset: number,
    limit: number
  ): Promise<PublicChannelListing[]> {
    return this.mirroredBackend.getPublicChannels(offset, limit);
  }

  joinChannel<JoinInfo extends ChannelJoinInfo>(
    info: JoinInfo
  ): Promise<string | null> {
    return this.mirroredBackend.joinChannel(info);
  }

  channelsSubscribable: Subscribable<Channel[] | null> | undefined;

  getChannels(): Subscribable<Channel[] | null> {
    return (
      this.channelsSubscribable ||
      (this.channelsSubscribable = this.mirroredBackend.getChannels())
    );
  }

  clearCache(): Promise<void> {
    throw new Error("Method not implemented.");
    // TODO: Should this clear the cached backend cache?
  }

  connectChannel(id: number): Promise<ChannelBackend | null> {
    return this.mirroredBackend.connectChannel(id);
  }

  channelSubscribableMap: Record<string, Subscribable<Channel | null>> = {};

  getChannel(id: number): Subscribable<Channel | null> {
    return (
      this.channelSubscribableMap[id] ||
      (this.channelSubscribableMap[id] = this.mirroredBackend.getChannel(id))
    );
  }
}
