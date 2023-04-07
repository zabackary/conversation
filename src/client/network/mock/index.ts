/* eslint-disable no-cond-assign */
/* eslint-disable class-methods-use-this */
import Channel, {
  DmChannel,
  PrivacyLevel,
  PublicChannelListing,
} from "../../../model/channel";
import User, { NewUserMetadata } from "../../../model/user";
import {
  validatePassword,
  validateText,
  validateUrl,
} from "../../../shared/validation";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
  LoggedOutException,
  Subscribable,
} from "../NetworkBackend";
import { createSubscribable, mapSubscribable, wait } from "../utils";
import MockChannelBackend from "./mock_channel";
import { channels, loggedInUser, users, usersAuth } from "./mock_data";

export default class MockBackend implements NetworkBackend {
  async authLogIn(email: string, password: string): Promise<void> {
    await wait();
    const name = Object.entries(users).find(
      ([, user]) => user.value.getSnapshot().email === email
    )?.[0] as keyof typeof users | undefined;
    if (!name || usersAuth[name].password !== password) {
      throw new Error("Failed to authenticate.");
    } else {
      console.log("signing in w/", name);
      loggedInUser.dispatch(users[name].value.getSnapshot());
      console.log(loggedInUser.value.getSnapshot());
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
    return createSubscribable(async (next) => {
      await wait();
      next(Math.random() > 0.5);
      for (;;) {
        // eslint-disable-next-line no-await-in-loop
        await wait(2000 + Math.random() * 10000);
        next(Math.random() > 0.5);
      }
    });
  }

  getDMs(): Subscribable<DmChannel[]> {
    return createSubscribable(async (next) => {
      await wait();
      const user = loggedInUser.value.getSnapshot();
      if (!user) throw new LoggedOutException();
      next(
        Object.values(channels).filter(
          (channel) => channel.dm && channel.members.includes(user)
        ) as DmChannel[]
      );
    });
  }

  getChannel(id: number): Subscribable<Channel | null> {
    return mapSubscribable(loggedInUser.value, async (user) => {
      await wait();
      if (user === null) return new LoggedOutException();
      if (user instanceof Error) return user;
      // @ts-ignore Again, there's a null check! It should be *fine*.
      const channel = channels[id] as Channel | undefined;
      if (channel && channel.members.includes(user)) {
        return channel;
      }
      return null;
    });
  }

  getUser(id?: number): Subscribable<User> {
    if (id) throw new Error("mock doesn't support getting users by ID yet");
    return mapSubscribable(loggedInUser.value, (user) =>
      user === null ? new LoggedOutException() : user
    );
  }

  async connectChannel(id: number): Promise<ChannelBackend | null> {
    await wait();
    // @ts-ignore Again, there's a null check! It should be *fine*.
    const channel = channels[id] as Channel | undefined;
    const user = loggedInUser.value.getSnapshot();
    if (!user || !channel || !channel.members.includes(user)) {
      return null;
    }
    return new MockChannelBackend(id);
  }

  getPublicChannels(): Subscribable<PublicChannelListing[]> {
    return mapSubscribable(loggedInUser.value, async (user) => {
      await wait();
      if (user === null) return new LoggedOutException();
      if (user instanceof Error) return user;
      return Object.values(channels).filter(
        (channel) =>
          !channel.members.map((member) => member.id).includes(user.id) &&
          channel.privacyLevel === PrivacyLevel.Public
      );
    });
  }

  async joinChannel<JoinInfo extends ChannelJoinInfo>(_info: JoinInfo) {
    await wait();
    console.error("joinChannel not implemented.");
    return null;
  }

  getChannels(): Subscribable<Channel[]> {
    return mapSubscribable(loggedInUser.value, async (user) => {
      await wait();
      if (user === null) return new LoggedOutException();
      if (user instanceof Error) return user;
      return Object.values(channels).filter(
        (channel) =>
          !channel.dm &&
          channel.members.map((member) => member.id).includes(user.id)
      );
    });
  }

  clearCache() {
    console.log("Cache cleared, but there is no cache! :D");
    return new Promise<void>((resolve) => {
      resolve();
    });
  }
}
