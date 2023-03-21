/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import getChannel from "./getters/getChannel";
import getMessage from "./getters/getMessage";
import getUser from "./getters/getUser";

export type SupabaseUser = Awaited<ReturnType<typeof getUser>>;

export type SupabaseChannel = Awaited<ReturnType<typeof getChannel>>;

export type SupabaseMessage = Awaited<ReturnType<typeof getMessage>>;

export default class SupabaseCache {
  users: Record<string, SupabaseUser> = {};

  putUser(...users: SupabaseUser[]) {
    for (const user of users) {
      this.users[user.id] = user;
    }
  }

  getUser(id: string) {
    return this.users[id] ?? null;
  }

  async getUserOrFallback(id: string, fallback: () => Promise<SupabaseUser>) {
    return this.users[id] ?? (this.users[id] = await fallback());
  }

  channels: Record<number, SupabaseChannel> = {};

  putChannel(...channels: SupabaseChannel[]) {
    for (const channel of channels) {
      this.channels[channel.id] = channel;
    }
  }

  getChannel(id: number) {
    return this.channels[id] ?? null;
  }

  async getChannelOrFallback(
    id: number,
    fallback: () => Promise<SupabaseChannel>
  ) {
    return this.channels[id] ?? (this.channels[id] = await fallback());
  }
}
