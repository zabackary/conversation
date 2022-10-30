import { PrivacyLevel } from "../../data/channel";
import NetworkManager, {
  ChannelJoinInfo,
  ChannelManager,
} from "./network_definitions";

export default class MockNetworkManager implements NetworkManager {
  connectChannel(id: number): Promise<ChannelManager> {
    throw new Error("Method not implemented.");
  }

  async getPublicChannels() {
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
  async joinChannel<JoinInfo extends ChannelJoinInfo>(info: JoinInfo) {
    console.error("joinChannel not implemented.");
    return null;
  }
  async getChannels() {
    return [
      {
        name: "Hey",
        description: "Say hey to one another here.",
        id: 5,
        members: [],
        privacyLevel: PrivacyLevel.Unlisted,
        history: 10,
        dm: false,
      },
      {
        name: "Mock",
        description: "I'm going to mock you a bunch.",
        id: 3,
        members: [],
        privacyLevel: PrivacyLevel.Private,
        history: 10,
        dm: false,
      },
    ];
  }
  async clearCache() {
    console.log("Cache cleared, but there is no cache! :D");
  }
}
