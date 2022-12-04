/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import Channel, {
  PrivacyLevel,
  PublicChannelListing,
} from "../../data/channel";
import User from "../../data/user";
import MockChannelBackend from "./mock_channel";
import { channels, users } from "./mock_data";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
  Subscribable,
} from "./network_definitions";
import { createSubscribable, wait } from "./utils";

const LOGGED_IN_USER = users.bob;

export default class MockBackend implements NetworkBackend {
  getChannel(id: number): Subscribable<Channel | null> {
    return createSubscribable(async (next) => {
      await wait();
      const channel = channels[id];
      if (channel && channel.members.includes(LOGGED_IN_USER)) {
        next(channel);
      } else {
        next(null);
      }
    });
  }

  getUser(): Subscribable<User> {
    return createSubscribable(async (next) => {
      await wait();
      next(LOGGED_IN_USER);
    });
  }

  async connectChannel(id: number): Promise<ChannelBackend> {
    await wait();
    return new MockChannelBackend(id);
  }

  getPublicChannels(): Subscribable<PublicChannelListing[]> {
    return createSubscribable(async (next) => {
      await wait();
      next(
        Object.values(channels).filter(
          (channel) =>
            !channel.members.includes(LOGGED_IN_USER) &&
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
      next(
        Object.values(channels).filter((channel) =>
          channel.members.includes(LOGGED_IN_USER)
        )
      );
    });
  }

  async clearCache() {
    console.log("Cache cleared, but there is no cache! :D");
  }
}
