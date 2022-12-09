/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import Channel, { DmChannel, PublicChannelListing } from "../../data/channel";
import User, { UserStatus } from "../../data/user";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
  Subscribable,
} from "./network_definitions";

/**
 * This will be replaced by a real one at build time.
 */
export default class DefaultBackend implements NetworkBackend {
  getUser(): Subscribable<User> {
    throw new Error("Method not implemented.");
  }

  getStatus(user: string): Subscribable<UserStatus | null> {
    throw new Error("Method not implemented.");
  }

  getDMs(): Subscribable<DmChannel[]> {
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
  }

  clearCache(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  connectChannel(id: number): Promise<ChannelBackend | null> {
    throw new Error("Method not implemented.");
  }

  getChannel(id: number): Subscribable<Channel | null> {
    throw new Error("Method not implemented.");
  }
}
