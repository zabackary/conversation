/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-return-assign */
import Channel, {
  DmChannel,
  PrivacyLevel,
  PublicChannelListing,
} from "../../model/channel";
import User, { NewUserMetadata, UserId } from "../../model/user";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
  Subscribable,
} from "./NetworkBackend";

export default class CachedBackend implements NetworkBackend {
  isReady?: Promise<void>;

  constructor(private mirroredBackend: NetworkBackend) {
    this.isReady = mirroredBackend.isReady;
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

  userSubscribable: Subscribable<User | null> | undefined;

  userSubscribableMap: Record<string, Subscribable<User | null>> = {};

  getUser(user?: UserId): Subscribable<User | null> {
    if (!user) {
      return (
        this.userSubscribable ||
        (this.userSubscribable = this.mirroredBackend.getUser())
      );
    }
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

  dmsSubscribable: Subscribable<DmChannel[]> | undefined;

  getDMs(): Subscribable<DmChannel[]> {
    return (
      this.dmsSubscribable ||
      (this.dmsSubscribable = this.mirroredBackend.getDMs())
    );
  }

  publicChannelsSubscribable: Subscribable<PublicChannelListing[]> | undefined;

  getPublicChannels(): Subscribable<PublicChannelListing[]> {
    return (
      this.publicChannelsSubscribable ||
      (this.publicChannelsSubscribable =
        this.mirroredBackend.getPublicChannels())
    );
  }

  joinChannel<JoinInfo extends ChannelJoinInfo>(
    info: JoinInfo
  ): Promise<string | null> {
    return this.mirroredBackend.joinChannel(info);
  }

  channelsSubscribable: Subscribable<Channel[]> | undefined;

  getChannels(): Subscribable<Channel[]> {
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
