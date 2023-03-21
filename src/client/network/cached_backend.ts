/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-return-assign */
import Channel, { DmChannel, PublicChannelListing } from "../../model/channel";
import User, { NewUserMetadata } from "../../model/user";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
  Subscribable,
} from "./network_definitions";

export default class CachedBackend implements NetworkBackend {
  constructor(private mirroredBackend: NetworkBackend) {}

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

  getUser(): Subscribable<User | null> {
    return (
      this.userSubscribable ||
      (this.userSubscribable = this.mirroredBackend.getUser())
    );
  }

  statusSubscribableMap: Record<string, Subscribable<boolean | null>> = {};

  getStatus(user: string): Subscribable<boolean | null> {
    return (
      this.statusSubscribableMap[user] ||
      (this.statusSubscribableMap[user] = this.mirroredBackend.getStatus(user))
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
