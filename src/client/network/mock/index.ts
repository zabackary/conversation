/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-cond-assign */
/* eslint-disable class-methods-use-this */
import Channel, {
  DmChannel,
  GroupChannel,
  InvitedChannelListing,
  PrivacyLevel,
  PublicChannelListing,
} from "../../../model/channel";
import User, {
  NewUserMetadata,
  RegisteredUser,
  UserId,
} from "../../../model/user";
import {
  validatePassword,
  validateText,
  validateUrl,
} from "../../../shared/validation";
import NetworkBackend, {
  ChannelBackend,
  ChannelDetails,
  ChannelJoinInfo,
  LoggedOutException,
  Subscribable,
} from "../NetworkBackend";
import { wait } from "../utils";
import MockChannelBackend from "./mock_channel";
import { channels, loggedInUser, users, usersAuth } from "./mock_data";

export default class MockBackend implements NetworkBackend {
  isReady?: Promise<void> | undefined;

  getInvitedChannels(
    offset: number,
    limit: number
  ): Promise<InvitedChannelListing[]> {
    throw new Error("Method not implemented.");
  }

  addMembers(
    channel: number,
    userIds: UserId[],
    invitation: string
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  removeMembers(
    channel: number,
    useIds: UserId[],
    canRejoin?: boolean | undefined
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  generateLink(id: number): Promise<string> {
    throw new Error("Method not implemented.");
  }

  connectionState = new Subscribable<
    "error" | "connected" | "connecting" | "reconnecting"
  >(() => {
    // Noop
  }, "connected" as const);

  updateChannel(id: number, details: Partial<ChannelDetails>): Promise<void> {
    throw new Error("Method not implemented.");
  }

  deleteChannel(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }

  createChannel(
    _name: string,
    _description: string,
    _privacyLevel: PrivacyLevel,
    _password?: string | undefined
  ): Promise<Channel> {
    throw new Error("Method not implemented.");
  }

  async authLogIn(email: string, password: string): Promise<void> {
    await wait();
    const name = Object.entries(users).find(
      ([, user]) => user.getSnapshot().email === email
    )?.[0] as keyof typeof users | undefined;
    if (!name || usersAuth[name].password !== password) {
      throw new Error("Failed to authenticate.");
    } else {
      console.log("signing in w/", name);
      loggedInUser.dispatch(users[name].getSnapshot() as RegisteredUser);
      console.log(loggedInUser.getSnapshot());
    }
  }

  async authLogOut(): Promise<void> {
    await wait();
    loggedInUser.dispatch(null);
  }

  async authCreateAccount(
    newUser: NewUserMetadata,
    password: string
  ): Promise<void> {
    await wait();
    if (
      validatePassword(password) !== null ||
      !newUser.name ||
      validateText(newUser.name) !== null ||
      !newUser.nickname ||
      validateText(newUser.nickname) !== null ||
      (!!newUser.profilePicture && validateUrl(newUser.profilePicture) !== null)
    ) {
      throw new Error(`Failed to validate`);
    }
  }

  getUserActivity(_user: string): Subscribable<boolean | null> {
    return new Subscribable<boolean | null>(async (next) => {
      await wait();
      next(Math.random() > 0.5);
      for (;;) {
        // eslint-disable-next-line no-await-in-loop
        await wait(2000 + Math.random() * 10000);
        next(Math.random() > 0.5);
      }
    }, null);
  }

  getDMs(): Subscribable<DmChannel[] | null> {
    return new Subscribable<DmChannel[] | null>(async (next) => {
      await wait();
      const user = loggedInUser.getSnapshot();
      if (!user) {
        // TODO: logged out?
        return;
      }
      next(
        Object.values(channels).filter(
          (channel) => channel.dm && channel.members.includes(user)
        ) as DmChannel[]
      );
    }, null);
  }

  getChannel(id: number): Subscribable<Channel | null> {
    return loggedInUser.map(async (user) => {
      await wait();
      if (user === null) {
        // TODO: logged out?
        return null;
      }
      // @ts-ignore Again, there's a null check! It should be *fine*.
      const channel = channels[id] as Channel | undefined;
      if (channel && channel.members.includes(user)) {
        return channel;
      }
      return null;
    }, null);
  }

  getCurrentSession(): Subscribable<RegisteredUser | null> {
    return loggedInUser.downgrade();
  }

  getUser(id: number): Subscribable<User | null> {
    throw new Error("mock doesn't support getting users by ID yet");
  }

  async connectChannel(id: number): Promise<ChannelBackend | null> {
    await wait();
    // @ts-ignore Again, there's a null check! It should be *fine*.
    const channel = channels[id] as Channel | undefined;
    const user = loggedInUser.getSnapshot();
    if (!user || !channel || !channel.members.includes(user)) {
      return null;
    }
    return new MockChannelBackend(id);
  }

  async getPublicChannels(): Promise<PublicChannelListing[]> {
    await wait();
    const user = await this.getCurrentSession().next();
    if (user === null) throw new Error("Not logged in.");
    return Object.values(channels).filter(
      (channel) =>
        !channel.members.map((member) => member.id).includes(user.id) &&
        !channel.dm &&
        channel.privacyLevel === PrivacyLevel.Public
    ) as GroupChannel[];
  }

  async joinChannel<JoinInfo extends ChannelJoinInfo>(_info: JoinInfo) {
    await wait();
    console.error("joinChannel not implemented.");
    return null;
  }

  getChannels(): Subscribable<Channel[] | null> {
    return loggedInUser.map<Channel[] | null>(async (user) => {
      await wait();
      if (user === null) return null;
      return Object.values(channels).filter(
        (channel) =>
          !channel.dm &&
          channel.members.map((member) => member.id).includes(user.id)
      );
    }, null);
  }

  clearCache() {
    console.log("Cache cleared, but there is no cache! :D");
    return new Promise<void>((resolve) => {
      resolve();
    });
  }

  searchUsers(query: string): Promise<User[]> {
    throw new Error("Not implemented yet");
  }
}
