import { PrivacyLevel } from "../../data/channel";
import User from "../../data/user";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
} from "./network_definitions";

export default class MockBackend implements NetworkBackend {
  async getUser(): Promise<User> {
    return {
      name: "Zachary Cheng",
      nickname: "Zachary",
      email: "zacharycheng@stu.his.ac.jp",
      profilePicture: "https://www.w3schools.com/howto/img_avatar.png", // From w3schools
      id: 0,
    };
  }
  connectChannel(id: number): Promise<ChannelBackend> {
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
