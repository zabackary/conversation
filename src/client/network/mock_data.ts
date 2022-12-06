import Channel, { DmChannel, PrivacyLevel } from "../../data/channel";
import Message from "../../data/message";
import User, { UserStatus } from "../../data/user";

export const users: Record<string, User> = {
  bob: {
    name: "Bob Lastname",
    nickname: "Bob",
    email: "bob@example.com",
    profilePicture: "https://www.w3schools.com/howto/img_avatar.png", // From w3schools
    id: 0,
    status: UserStatus.Active,
  },
  alice: {
    name: "Alice Surname",
    nickname: "Alice",
    email: "alice@example.com",
    profilePicture: "https://www.w3schools.com/howto/img_avatar2.png", // From w3schools
    id: 1,
    status: UserStatus.Inactive,
  },
};
export const messages: Record<number, Message[]> = {
  5: [
    {
      user: users.bob,
      markdown: "This is *cool*.",
      sent: new Date("January 1, 2020 5:06"),
      id: 98,
      parent: 5,
    },
    {
      user: users.alice,
      markdown: "Imagine _mocking_ your brother :D",
      sent: new Date("March 25, 2021 3:06"),
      id: 35,
      parent: 3,
    },
    {
      user: users.alice,
      markdown: "@all What do you think of this app?",
      sent: new Date("January 1, 2020 4:48"),
      id: 22,
      parent: 5,
    },
    {
      user: users.bob,
      markdown: "# Hello, world!\nJust checking this works :)",
      sent: new Date("January 1, 2020 5:05"),
      id: 97,
      parent: 5,
    },
    {
      user: users.alice,
      markdown: `Ok, thanks @${users.bob.nickname}`,
      sent: new Date("January 1, 2020 5:10"),
      id: 104,
      parent: 5,
    },
    {
      user: users.alice,
      markdown: "How was your day today?",
      sent: new Date("January 3, 2020 2:05"),
      id: 938,
      parent: 5,
    },
    {
      user: users.bob,
      markdown: "Oh, it was ~~good~~ *bad*",
      sent: new Date("January 3, 2020 2:06"),
      id: 939,
      parent: 5,
    },
    {
      user: users.alice,
      markdown:
        "# Oh, I **see** now...\nWhat in the world did you eat for breakfast?",
      sent: new Date("January 3, 2020 2:07"),
      id: 263,
      parent: 5,
    },
    {
      user: users.bob,
      markdown: "I ate a banana. アリスは？", // Test Japanese
      sent: new Date("January 3, 2020 2:08"),
      id: 265,
      parent: 5,
    },
    {
      user: users.alice,
      markdown:
        "My house burned down so I didn't have any breakfast today.\n\n# Imagine",
      sent: new Date("January 3, 2020 2:09"),
      id: 268,
      parent: 5,
    },
    {
      user: users.bob,
      markdown: "## 面白い",
      sent: new Date("January 3, 2020 2:10"),
      id: 269,
      parent: 5,
    },
    {
      user: users.bob,
      markdown: "# spam",
      sent: new Date("January 3, 2020 2:11"),
      id: 270,
      parent: 5,
    },
    {
      user: users.bob,
      markdown: "## spam",
      sent: new Date("January 3, 2020 2:11"),
      id: 271,
      parent: 5,
    },
    {
      user: users.bob,
      markdown: "Spoiler:\n\n>! Someone *dies*.",
      sent: new Date("January 3, 2020 2:11"),
      id: 272,
      parent: 5,
    },
    {
      user: users.alice,
      markdown:
        "longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong",
      sent: new Date("January 3, 2020 2:15"),
      id: 273,
      parent: 5,
    },
  ],
  3: [],
  19: [
    {
      user: users.alice,
      markdown: `Hey @${users.bob.nickname}, this is ${users.alice.nickname}`,
      sent: new Date("December 6th, 2022 13:47"),
      id: 9381,
      parent: 19,
    },
    {
      user: users.bob,
      markdown: `Got ur message`,
      sent: new Date("December 6th, 2022 13:48"),
      id: 9382,
      parent: 19,
    },
  ],
};

export const channels: Record<number, Channel> = {
  5: {
    name: "Hey",
    description: "Say hey to one another here.",
    id: 5,
    members: [users.bob, users.alice],
    privacyLevel: PrivacyLevel.Unlisted,
    history: 10,
    dm: false,
    lastMessage: messages[5].at(-1),
  },
  3: {
    name: "Mock",
    description: "I'm going to mock you a bunch.",
    id: 3,
    members: [users.bob, users.alice],
    privacyLevel: PrivacyLevel.Private,
    history: 10,
    dm: false,
    lastMessage: messages[3].at(-1),
  },
  4: {
    name: "Hello World",
    description: "Place for people to say hello to their world a bunch.",
    id: 4,
    members: [users.alice],
    privacyLevel: PrivacyLevel.Public,
    history: 10,
    dm: false,
  },
  18: {
    name: "Bye World",
    description:
      "Place for people to bye hello to their world a bunch before they leave for Mars.",
    id: 18,
    members: [users.alice],
    privacyLevel: PrivacyLevel.Public,
    history: 10,
    dm: false,
  },
  19: {
    name: "",
    description: "",
    id: 19,
    members: [users.alice, users.bob],
    privacyLevel: PrivacyLevel.Private,
    history: 10,
    dm: true,
  } as DmChannel,
};
