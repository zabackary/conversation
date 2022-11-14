/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import { PrivacyLevel } from "../../data/channel";
import User from "../../data/user";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
} from "./network_definitions";

async function wait(): Promise<void>;
async function wait(ms: number): Promise<void>;
async function wait(ms?: number) {
  if (ms === undefined) {
    await new Promise((r) => {
      setTimeout(r, Math.random() * 1000);
    });
  } else {
    await new Promise((r) => {
      setTimeout(r, ms);
    });
  }
}

export default class MockBackend implements NetworkBackend {
  async getUser(): Promise<User> {
    await wait();
    return {
      name: "Zachary Cheng",
      nickname: "Zachary",
      email: "zacharycheng@stu.his.ac.jp",
      profilePicture: "https://www.w3schools.com/howto/img_avatar.png", // From w3schools
      id: 0,
    };
  }

  connectChannel(_id: number): Promise<ChannelBackend> {
    throw new Error("Method not implemented.");
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
        lastMessage: {
          user: {
            name: "Zachary Cheng",
            nickname: "Zachary",
            email: "zacharycheng@stu.his.ac.jp",
            profilePicture: "https://www.w3schools.com/howto/img_avatar.png", // From w3schools
            id: 0,
          },
          markdown: "This is *cool*.",
          sent: new Date("January 1st, 2020 5:06pm"),
          id: 98,
          parent: 5,
        },
      },
      {
        name: "Mock",
        description: "I'm going to mock you a bunch.",
        id: 3,
        members: [],
        privacyLevel: PrivacyLevel.Private,
        history: 10,
        dm: false,
        lastMessage: {
          user: {
            name: "Jeremy Cheng",
            nickname: "Jeremy",
            email: "jeremycheng@stu.his.ac.jp",
            profilePicture: "https://www.w3schools.com/howto/img_avatar.png", // From w3schools
            id: 1,
          },
          markdown: "Imagine _mocking_ your brother :D",
          sent: new Date("March 25st, 2021 3:06pm"),
          id: 35,
          parent: 3,
        },
      },
    ];
  }

  async clearCache() {
    console.log("Cache cleared, but there is no cache! :D");
  }
}
