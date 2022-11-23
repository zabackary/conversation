/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import { PrivacyLevel } from "../../data/channel";
import User from "../../data/user";
import MockChannelBackend from "./mock_channel";
import { messages, users } from "./mock_data";
import { wait } from "./mock_utils";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
} from "./network_definitions";

export default class MockBackend implements NetworkBackend {
  async getUser(): Promise<User> {
    await wait();
    return users.zachary;
  }

  async connectChannel(id: number): Promise<ChannelBackend> {
    await wait();
    return new MockChannelBackend(id);
  }

  async getPublicChannels() {
    await wait();
    return [
      {
        name: "Hello World",
        description: "Place for people to say hello to their world a bunch.",
        id: 4,
      },
      {
        name: "Bye World",
        description:
          "Place for people to bye hello to their world a bunch before they leave for Mars.",
        id: 18,
      },
    ];
  }

  async joinChannel<JoinInfo extends ChannelJoinInfo>(_info: JoinInfo) {
    await wait();
    console.error("joinChannel not implemented.");
    return null;
  }

  async getChannels() {
    await wait();
    return [
      {
        name: "Hey",
        description: "Say hey to one another here.",
        id: 5,
        members: [],
        privacyLevel: PrivacyLevel.Unlisted,
        history: 10,
        dm: false,
        lastMessage: messages.cool,
      },
      {
        name: "Mock",
        description: "I'm going to mock you a bunch.",
        id: 3,
        members: [],
        privacyLevel: PrivacyLevel.Private,
        history: 10,
        dm: false,
        lastMessage: messages.mock,
      },
    ];
  }

  async clearCache() {
    console.log("Cache cleared, but there is no cache! :D");
  }
}
