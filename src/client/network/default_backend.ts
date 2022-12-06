/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import channel, { DmChannel, PublicChannelListing } from "../../data/channel";
import user, { UserStatus } from "../../data/user";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
  Subscribable,
} from "./network_definitions";

/**
 * This will be replaced by a real one at build time.
 */
export default class DefaultBackend implements NetworkBackend {
  getStatus(username: string): Subscribable<UserStatus | null> {
    throw new Error("Method not implemented.");
  }

  getDMs(): Subscribable<DmChannel[]> {
    throw new Error("Method not implemented.");
  }

  getUser(): Subscribable<user> {
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

  getChannels(): Subscribable<channel[]> {
    throw new Error("Method not implemented.");
  }

  clearCache(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  connectChannel(id: number): Promise<ChannelBackend> {
    throw new Error("Method not implemented.");
  }

  getChannel(id: number): Subscribable<channel | null> {
    throw new Error("Method not implemented.");
  }
}
