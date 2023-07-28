/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { DispatchableSubscribable } from "../Subscribable";
import getAttachment from "./getters/getAttachment";
import getChannel from "./getters/getChannel";
import getMessage from "./getters/getMessage";
import getUser from "./getters/getUser";

export type SupabaseUser = Awaited<ReturnType<typeof getUser>>;

export type SupabaseChannel = Awaited<ReturnType<typeof getChannel>>;

export type SupabaseMessage = Awaited<ReturnType<typeof getMessage>>;

export type SupabaseAttachment = Awaited<ReturnType<typeof getAttachment>>;

export default class SupabaseCache {
  private users: Record<
    string,
    | DispatchableSubscribable<SupabaseUser>
    | Promise<DispatchableSubscribable<SupabaseUser>>
  > = {};

  putUser(...users: SupabaseUser[]) {
    for (const user of users) {
      const oldValue = this.users[user.id];
      if (oldValue && !("then" in oldValue)) {
        oldValue.dispatch(user);
      } else if (!oldValue) {
        this.users[user.id] = new DispatchableSubscribable(user);
      }
    }
  }

  async getUserOrFallback(id: string, fallback: () => Promise<SupabaseUser>) {
    return (
      this.users[id] ??
      (this.users[id] = fallback().then((value) => {
        const subscribable = new DispatchableSubscribable<typeof value>(value);
        this.users[id] = subscribable;
        return subscribable;
      }))
    );
  }

  private channels: Record<
    number,
    | DispatchableSubscribable<SupabaseChannel>
    | Promise<DispatchableSubscribable<SupabaseChannel>>
  > = {};

  putChannel(...channels: SupabaseChannel[]) {
    for (const channel of channels) {
      this.putUser(...channel.users);
      const oldValue = this.channels[channel.id];
      if (oldValue && !("then" in oldValue)) {
        oldValue.dispatch(channel);
      } else if (!oldValue) {
        this.channels[channel.id] = new DispatchableSubscribable(channel);
      }
    }
  }

  async getChannelOrFallback(
    id: number,
    fallback: () => Promise<SupabaseChannel>
  ) {
    return (
      this.channels[id] ??
      (this.channels[id] = fallback().then((value) => {
        this.putUser(...value.users);
        const subscribable = new DispatchableSubscribable<typeof value>(value);
        this.channels[id] = subscribable;
        return subscribable;
      }))
    );
  }

  private messages: Record<
    number,
    | DispatchableSubscribable<SupabaseMessage>
    | Promise<DispatchableSubscribable<SupabaseMessage>>
  > = {};

  putMessage(...messages: SupabaseMessage[]) {
    for (const message of messages) {
      const oldValue = this.messages[message.id];
      if (oldValue && !("then" in oldValue)) {
        oldValue.dispatch(message);
      } else if (!oldValue) {
        this.messages[message.id] = new DispatchableSubscribable(message);
      }
    }
  }

  async getMessageOrFallback(
    id: number,
    fallback: () => Promise<SupabaseMessage>
  ) {
    return (
      this.messages[id] ??
      (this.messages[id] = fallback().then((value) => {
        const subscribable = new DispatchableSubscribable<typeof value>(value);
        this.messages[id] = subscribable;
        return subscribable;
      }))
    );
  }

  private attachments: Record<
    string,
    | DispatchableSubscribable<SupabaseAttachment>
    | Promise<DispatchableSubscribable<SupabaseAttachment>>
  > = {};

  putAttachment(...attachments: SupabaseAttachment[]) {
    for (const attchment of attachments) {
      const oldValue = this.attachments[attchment.id];
      if (oldValue && !("then" in oldValue)) {
        oldValue.dispatch(attchment);
      } else if (!oldValue) {
        this.attachments[attchment.id] = new DispatchableSubscribable(
          attchment
        );
      }
    }
  }

  async getAttachmentOrFallback(
    id: string,
    fallback: () => Promise<SupabaseAttachment>
  ) {
    return (
      this.attachments[id] ??
      (this.attachments[id] = fallback().then((value) => {
        const subscribable = new DispatchableSubscribable<typeof value>(value);
        this.attachments[id] = subscribable;
        return subscribable;
      }))
    );
  }

  private channelList:
    | DispatchableSubscribable<SupabaseChannel[]>
    | Promise<DispatchableSubscribable<SupabaseChannel[]>>
    | undefined;

  putChannelList(channelList: SupabaseChannel[]) {
    this.putChannel(...channelList);
    if (this.channelList && !("then" in this.channelList)) {
      this.channelList.dispatch(channelList);
    } else if (!this.channelList) {
      this.channelList = new DispatchableSubscribable(channelList);
    }
  }

  async getChannelListOrFallback(fallback: () => Promise<SupabaseChannel[]>) {
    return (
      this.channelList ??
      (this.channelList = fallback().then((value) => {
        this.putChannel(...value);
        const subscribable = new DispatchableSubscribable<typeof value>(value);
        this.channelList = subscribable;
        return subscribable;
      }))
    );
  }

  clearUserDependentState() {
    if (this.channelList && !("then" in this.channelList)) {
      this.channelList.dispatch([]);
      this.channelList = undefined;
    }
  }
}
