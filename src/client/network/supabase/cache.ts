/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import getChannel from "./getters/getChannel";
import getMessage from "./getters/getMessage";
import getUser from "./getters/getUser";

export type SupabaseUser = Awaited<ReturnType<typeof getUser>>;

export type SupabaseChannel = Awaited<ReturnType<typeof getChannel>>;

export type SupabaseMessage = Awaited<ReturnType<typeof getMessage>>;

export default class SupabaseCache {
  users: Record<string, SupabaseUser | Promise<SupabaseUser>> = {};

  putUser(...users: SupabaseUser[]) {
    for (const user of users) {
      this.users[user.id] = user;
    }
  }

  async getUserOrFallback(id: string, fallback: () => Promise<SupabaseUser>) {
    return this.users[id] ?? (this.users[id] = fallback());
  }

  channels: Record<number, SupabaseChannel | Promise<SupabaseChannel>> = {};

  putChannel(...channels: SupabaseChannel[]) {
    for (const channel of channels) {
      this.channels[channel.id] = channel;
    }
  }

  async getChannelOrFallback(
    id: number,
    fallback: () => Promise<SupabaseChannel>
  ) {
    return this.channels[id] ?? (this.channels[id] = fallback());
  }

  messages: Record<number, SupabaseMessage | Promise<SupabaseMessage>> = {};

  putMessage(...messages: SupabaseMessage[]) {
    for (const message of messages) {
      this.messages[message.id] = message;
    }
  }

  async getMessageOrFallback(
    id: number,
    fallback: () => Promise<SupabaseMessage>
  ) {
    return this.messages[id] ?? (this.messages[id] = await fallback());
  }
}
