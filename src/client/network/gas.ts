/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import channel, { PublicChannelListing } from "../../data/channel";
import user from "../../data/user";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
  Subscribable,
} from "./network_definitions";

// TODO: Implement this, and remove the eslint disables up top.
export default class GASBackend implements NetworkBackend {
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
