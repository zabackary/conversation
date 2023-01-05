/* eslint-disable no-cond-assign */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import Channel, {
  DmChannel,
  PrivacyLevel,
  PublicChannelListing,
} from "../../model/channel";
import User, { NewUser, UserStatus } from "../../model/user";
import {
  InvalidPasswordReason,
  InvalidTextReason,
  validatePassword,
  validateText,
  validateUrl,
} from "../../shared/validation";
import MockChannelBackend from "./mock_channel";
import {
  channels,
  getLoggedInUser,
  setLoggedInUser,
  users,
  usersAuth,
} from "./mock_data";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
  LoggedOutException,
  Subscribable,
} from "./network_definitions";
import { createSubscribable, wait } from "./utils";

export default class MockBackend implements NetworkBackend {
  async authLogIn(email: string, password: string): Promise<void> {
    await wait();
    const name = Object.entries(users).find(
      ([, user]) => user.email === email
    )?.[0] as keyof typeof users | undefined;
    if (!name || usersAuth[name].password !== password) {
      throw new Error("Failed to authenticate.");
    } else {
      setLoggedInUser(users[name]);
    }
  }

  async authLogOut(): Promise<void> {
    await wait();
    setLoggedInUser(null);
  }

  async authCreateAccount(newUser: NewUser, password: string): Promise<void> {
    await wait();
    let reason: InvalidPasswordReason | InvalidTextReason | null = null;
    if (
      (reason = validatePassword(password)) !== null ||
      (reason = validateText(newUser.name)) !== null ||
      (reason = validateText(newUser.nickname)) !== null ||
      (!!newUser.profilePicture && validateUrl(newUser.profilePicture) !== null)
    ) {
      throw new Error(`Failed to validate: ${reason}`);
    }
  }

  getStatus(user: string): Subscribable<UserStatus | null> {
    return createSubscribable(async (next) => {
      await wait();
      // @ts-ignore There's a null check later. Relax, TypeScript!
      const dbUser = users[user];
      next(dbUser ? dbUser.status : null);
    });
  }

  getDMs(): Subscribable<DmChannel[]> {
    return createSubscribable(async (next) => {
      await wait();
      if (!getLoggedInUser()) throw new LoggedOutException();
      next(
        Object.values(channels).filter(
          (channel) =>
            channel.dm &&
            channel.members.length === 2 &&
            // @ts-ignore They're compatible, whatever
            channel.members.includes(getLoggedInUser())
        ) as DmChannel[]
      );
    });
  }

  getChannel(id: number): Subscribable<Channel | null> {
    return createSubscribable(async (next) => {
      await wait();
      // @ts-ignore Again, there's a null check! It should be *fine*.
      const channel: Channel | undefined = channels[id];
      const user = getLoggedInUser();
      if (user && channel && channel.members.includes(user)) {
        next(channel);
      } else {
        next(null);
      }
    });
  }

  getUser(): Subscribable<User> {
    return createSubscribable(async (next) => {
      await wait();
      const user = getLoggedInUser();
      if (!user) throw new LoggedOutException();
      next(user);
    });
  }

  async connectChannel(id: number): Promise<ChannelBackend | null> {
    await wait();
    // @ts-ignore Again, there's a null check! It should be *fine*.
    const channel: Channel | undefined = channels[id];
    const user = getLoggedInUser();
    if (!user || !channel || !channel.members.includes(user)) {
      return null;
    }
    return new MockChannelBackend(id);
  }

  getPublicChannels(): Subscribable<PublicChannelListing[]> {
    return createSubscribable(async (next) => {
      await wait();
      const user = getLoggedInUser();
      if (!user) throw new LoggedOutException();
      next(
        Object.values(channels).filter(
          (channel) =>
            !channel.members.map((member) => member.id).includes(user.id) &&
            channel.privacyLevel === PrivacyLevel.Public
        )
      );
    });
  }

  async joinChannel<JoinInfo extends ChannelJoinInfo>(_info: JoinInfo) {
    await wait();
    console.error("joinChannel not implemented.");
    return null;
  }

  getChannels(): Subscribable<Channel[]> {
    return createSubscribable(async (next) => {
      await wait();
      const user = getLoggedInUser();
      if (!user) throw new LoggedOutException();
      next(
        Object.values(channels).filter(
          (channel) =>
            !channel.dm &&
            channel.members.map((member) => member.id).includes(user.id)
        )
      );
    });
  }

  async clearCache() {
    console.log("Cache cleared, but there is no cache! :D");
  }
}
