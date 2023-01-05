/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import Channel, { DmChannel, PublicChannelListing } from "../../model/channel";
import User, { NewUser, UserStatus } from "../../model/user";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
  Subscribable,
} from "./network_definitions";

// TODO: Implement this, and remove the eslint disables up top.
export default class GASBackend implements NetworkBackend {
  authLogIn(email: string, password: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  authLogOut(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  authCreateAccount(newUser: NewUser, password: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getStatus(username: string): Subscribable<UserStatus | null> {
    throw new Error("Method not implemented.");
  }

  getDMs(): Subscribable<DmChannel[]> {
    throw new Error("Method not implemented.");
  }

  getUser(): Subscribable<User> {
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

  connectChannel(id: number): Promise<ChannelBackend> {
    throw new Error("Method not implemented.");
  }

  getChannel(id: number): Subscribable<Channel | null> {
    throw new Error("Method not implemented.");
  }
}
