import Channel, { PrivacyLevel } from "../../model/channel";
import Message, {
  ServiceMessageBuiltInIcon,
  ServiceMessageFormat,
} from "../../model/message";
import Service from "../../model/service";
import User, { UserStatus } from "../../model/user";

export const services = {
  conversation: {
    name: "Conversation",
    icon: "",
    banner: "",
    author: null,
  },
} satisfies Record<string, Service>;

export const users = {
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
  eve: {
    name: "Eve Familyname",
    nickname: "Eve",
    email: "eve@example.com",
    profilePicture: null, // None on purpose
    id: 2,
    status: UserStatus.Active,
  },
} satisfies Record<string, User>;

export const messages = {
  5: [
    {
      icon: ServiceMessageBuiltInIcon.Flag,
      user: services.conversation,
      format: ServiceMessageFormat.Card,
      title: "This is the start of Chat.",
      subheader:
        "It's pretty quiet in here. Why don't you go ahead and say something?",
      id: 9384,
      parent: 5,
      sent: new Date("December 25, 2019 5:05"),
      isService: true,
    },
    {
      user: users.bob,
      markdown: "This is *cool*.",
      sent: new Date("December 25, 2019 5:06"),
      id: 98,
      parent: 5,
      isService: false,
    },
    {
      icon: ServiceMessageBuiltInIcon.PersonAdd,
      user: services.conversation,
      format: ServiceMessageFormat.Caption,
      title: `${users.bob.name} added ${users.alice.name} to the channel.`,
      id: 9385,
      parent: 5,
      sent: new Date("December 25, 2019 5:06"),
      isService: true,
    },
    {
      user: users.alice,
      markdown: "Imagine _mocking_ your brother :D",
      sent: new Date("December 25, 2019 6:05"),
      id: 35,
      parent: 3,
      isService: false,
    },
    {
      user: users.alice,
      markdown: "@all What do you think of this app?",
      sent: new Date("January 1, 2020 4:48"),
      id: 22,
      parent: 5,
      isService: false,
    },
    {
      user: users.bob,
      markdown: "# Hello, world!\nJust checking this works :)",
      sent: new Date("January 1, 2020 5:05"),
      id: 97,
      parent: 5,
      isService: false,
    },
    {
      icon: ServiceMessageBuiltInIcon.Edit,
      user: services.conversation,
      format: ServiceMessageFormat.Caption,
      title: `${users.bob.name} changed the name of this channel to Hey.`,
      id: 9386,
      parent: 5,
      sent: new Date("January 1, 2020 5:09"),
      isService: true,
    },
    {
      user: users.alice,
      markdown: `Ok, thanks @${users.bob.nickname}`,
      sent: new Date("January 1, 2020 5:10"),
      id: 104,
      parent: 5,
      isService: false,
    },
    {
      user: users.alice,
      markdown: "How was your day today?",
      sent: new Date("January 3, 2020 2:05"),
      id: 938,
      parent: 5,
      isService: false,
    },
    {
      user: users.bob,
      markdown: "Oh, it was ~~good~~ *bad*",
      sent: new Date("January 3, 2020 2:06"),
      id: 939,
      parent: 5,
      isService: false,
    },
    {
      user: users.alice,
      markdown:
        "# Oh, I **see** now...\nWhat in the world did you eat for breakfast?",
      sent: new Date("January 3, 2020 2:07"),
      id: 263,
      parent: 5,
      isService: false,
    },
    {
      user: users.bob,
      markdown: "I ate a banana. アリスは？", // Test Japanese
      sent: new Date("January 3, 2020 2:08"),
      id: 265,
      parent: 5,
      isService: false,
    },
    {
      user: users.alice,
      markdown:
        "My house burned down so I didn't have any breakfast today.\n\n# Imagine",
      sent: new Date("January 3, 2020 2:09"),
      id: 268,
      parent: 5,
      isService: false,
    },
    {
      user: users.bob,
      markdown: "## 面白い",
      sent: new Date("January 3, 2020 2:10"),
      id: 269,
      parent: 5,
      isService: false,
    },
    {
      user: users.bob,
      markdown: "# spam",
      sent: new Date("January 3, 2020 2:11"),
      id: 270,
      parent: 5,
      isService: false,
    },
    {
      user: users.bob,
      markdown: "## spam",
      sent: new Date("January 3, 2020 2:11"),
      id: 271,
      parent: 5,
      isService: false,
    },
    {
      user: users.bob,
      markdown: "Spoiler:\n\n>! Someone *dies*.",
      sent: new Date("January 3, 2020 2:11"),
      id: 272,
      parent: 5,
      isService: false,
    },
    {
      user: users.alice,
      markdown:
        "longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong",
      sent: new Date("January 3, 2020 2:15"),
      id: 273,
      parent: 5,
      isService: false,
    },
  ],
  3: [
    {
      icon: ServiceMessageBuiltInIcon.Flag,
      user: services.conversation,
      format: ServiceMessageFormat.Card,
      title: "This is the start of Mock.",
      subheader:
        "It's pretty quiet in here. Why don't you go ahead and say something?",
      id: 3749,
      parent: 3,
      sent: new Date("December 25, 2019 5:05"),
      isService: true,
    },
  ],
  19: [
    {
      icon: ServiceMessageBuiltInIcon.Flag,
      user: services.conversation,
      format: ServiceMessageFormat.Card,
      title: "This is the start of this DM.",
      subheader:
        "It's pretty quiet in here. Why don't you go ahead and say something?",
      id: 3750,
      parent: 19,
      sent: new Date("December 6, 2022 13:47"),
      isService: true,
    },
    {
      user: users.alice,
      markdown: `Hey @${users.bob.nickname}, this is ${users.alice.nickname}`,
      sent: new Date("December 6, 2022 13:47"),
      id: 9381,
      parent: 19,
      isService: false,
    },
    {
      user: users.bob,
      markdown: `Got ur message`,
      sent: new Date("December 6, 2022 13:48"),
      id: 9382,
      parent: 19,
      isService: false,
    },
  ],
  20: [
    {
      icon: ServiceMessageBuiltInIcon.Flag,
      user: services.conversation,
      format: ServiceMessageFormat.Card,
      title: "This is the start of this DM.",
      subheader:
        "It's pretty quiet in here. Why don't you go ahead and say something?",
      id: 5750,
      parent: 20,
      sent: new Date("December 6, 2022 13:47"),
      isService: true,
    },
    {
      user: users.eve,
      markdown: `You doing okay @${users.bob.nickname}?`,
      sent: new Date("December 6, 2022 13:47"),
      id: 1381,
      parent: 20,
      isService: false,
    },
    {
      user: users.bob,
      markdown: `Yeah, I'm fine`,
      sent: new Date("December 6, 2022 13:48"),
      id: 8382,
      parent: 20,
      isService: false,
    },
    {
      user: users.eve,
      markdown: `Just checking`,
      sent: new Date("December 6, 2022 13:49"),
      id: 8383,
      parent: 20,
      isService: false,
    },
  ],
} satisfies Record<number, Message[]>;

export const channels = {
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
  },
  20: {
    name: "",
    description: "",
    id: 20,
    members: [users.eve, users.bob],
    privacyLevel: PrivacyLevel.Private,
    history: 10,
    dm: true,
  },
} satisfies Record<number, Channel>;

export const LOGGED_IN_USER: User | null = null;
