import Channel, { PrivacyLevel } from "../../../model/channel";
import Message from "../../../model/message";
import User, { PrivilegeLevel } from "../../../model/user";
import {
  CleanDispatchableSubscribable,
  createCleanDispatchableSubscribable,
} from "../utils";

export const services = {
  conversation: {
    name: "Conversation",
    profilePicture: "",
    banner: "",
    author: undefined,
    id: 98219,
    isBot: true,
    privilegeLevel: PrivilegeLevel.Normal,
  },
} satisfies Record<string, User>;

export const users = {
  bob: createCleanDispatchableSubscribable<User>({
    name: "Bob Lastname",
    nickname: "Bob",
    email: "noreply+bob@stu.his.ac.jp",
    profilePicture: "https://www.w3schools.com/howto/img_avatar.png", // From w3schools
    id: 0,
    status: "Testing stuff",
    privilegeLevel: PrivilegeLevel.Normal,
    active: true,
    isBot: false,
  }),
  alice: createCleanDispatchableSubscribable<User>({
    name: "Alice Surname",
    nickname: "Alice",
    email: "noreply+alice@stu.his.ac.jp",
    profilePicture: "https://www.w3schools.com/howto/img_avatar2.png", // From w3schools
    id: 1,
    privilegeLevel: PrivilegeLevel.Normal,
    active: false,
    isBot: false,
  }),
  eve: createCleanDispatchableSubscribable<User>({
    name: "Eve Familyname",
    nickname: "Eve",
    email: "noreply+eve@stu.his.ac.jp",
    profilePicture: undefined, // None on purpose
    id: 2,
    privilegeLevel: PrivilegeLevel.Normal,
    active: true,
    isBot: false,
  }),
} satisfies Record<string, CleanDispatchableSubscribable<User>>;

export const usersAuth = {
  bob: {
    password: "________", // 8 underscores
  },
  alice: {
    password: "my great password",
  },
  eve: {
    password: "NUL haha",
  },
} satisfies { [K in keyof typeof users]: { password: string } };

export const messages = {
  5: [
    {
      user: services.conversation,
      markdown: "!translation:chat_start:Chat",
      id: 9384,
      parent: 5,
      sent: new Date("December 25, 2019 5:05"),
      isService: true,
    },
    {
      user: users.bob.value.getSnapshot(),
      markdown: "This is *cool*.",
      sent: new Date("December 25, 2019 5:06"),
      id: 98,
      parent: 5,
      isService: false,
    },
    {
      user: services.conversation,
      markdown: `!translation:chat_member_add:${
        users.bob.value.getSnapshot().name
      }:${users.alice.value.getSnapshot().name}`,
      id: 9385,
      parent: 5,
      sent: new Date("December 25, 2019 5:06"),
      isService: true,
    },
    {
      user: users.alice.value.getSnapshot(),
      markdown: "Imagine _mocking_ your brother :D",
      sent: new Date("December 25, 2019 6:05"),
      id: 35,
      parent: 3,
      isService: false,
    },
    {
      user: users.alice.value.getSnapshot(),
      markdown: "@all What do you think of this app?",
      sent: new Date("January 1, 2020 4:48"),
      id: 22,
      parent: 5,
      isService: false,
    },
    {
      user: users.bob.value.getSnapshot(),
      markdown: "# Hello, world!\nJust checking this works :)",
      sent: new Date("January 1, 2020 5:05"),
      id: 97,
      parent: 5,
      isService: false,
    },
    {
      user: services.conversation,
      markdown: `!translation:chat_name_change:${
        users.bob.value.getSnapshot().name
      }:Hey.`,
      id: 9386,
      parent: 5,
      sent: new Date("January 1, 2020 5:09"),
      isService: true,
    },
    {
      user: users.alice.value.getSnapshot(),
      markdown: `Ok, thanks @${users.bob.value.getSnapshot().nickname ?? ""}`,
      sent: new Date("January 1, 2020 5:10"),
      id: 104,
      parent: 5,
      isService: false,
    },
    {
      user: users.alice.value.getSnapshot(),
      markdown: "How was your day today?",
      sent: new Date("January 3, 2020 2:05"),
      id: 938,
      parent: 5,
      isService: false,
    },
    {
      user: users.bob.value.getSnapshot(),
      markdown: "Oh, it was ~~good~~ *bad*",
      sent: new Date("January 3, 2020 2:06"),
      id: 939,
      parent: 5,
      isService: false,
    },
    {
      user: users.alice.value.getSnapshot(),
      markdown:
        "# Oh, I **see** now...\nWhat in the world did you eat for breakfast?",
      sent: new Date("January 3, 2020 2:07"),
      id: 263,
      parent: 5,
      isService: false,
    },
    {
      user: users.bob.value.getSnapshot(),
      markdown: "I ate a banana. アリスは？", // Test Japanese
      sent: new Date("January 3, 2020 2:08"),
      id: 265,
      parent: 5,
      isService: false,
    },
    {
      user: users.alice.value.getSnapshot(),
      markdown:
        "My house burned down so I didn't have any breakfast today.\n\n# Imagine",
      sent: new Date("January 3, 2020 2:09"),
      id: 268,
      parent: 5,
      isService: false,
    },
    {
      user: users.bob.value.getSnapshot(),
      markdown: "## 面白い",
      sent: new Date("January 3, 2020 2:10"),
      id: 269,
      parent: 5,
      isService: false,
    },
    {
      user: users.bob.value.getSnapshot(),
      markdown: "# spam",
      sent: new Date("January 3, 2020 2:11"),
      id: 270,
      parent: 5,
      isService: false,
    },
    {
      user: users.bob.value.getSnapshot(),
      markdown: "## spam",
      sent: new Date("January 3, 2020 2:11"),
      id: 271,
      parent: 5,
      isService: false,
    },
    {
      user: users.bob.value.getSnapshot(),
      markdown: "Spoiler:\n\n>! Someone *dies*.",
      sent: new Date("January 3, 2020 2:11"),
      id: 272,
      parent: 5,
      isService: false,
    },
    {
      user: users.alice.value.getSnapshot(),
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
      user: services.conversation,
      markdown: "!translation:chat_start:Mock",
      id: 3749,
      parent: 3,
      sent: new Date("December 25, 2019 5:05"),
      isService: true,
    },
  ],
  19: [
    {
      user: services.conversation,
      markdown: "!translation:dm_start",
      id: 3750,
      parent: 19,
      sent: new Date("December 6, 2022 13:47"),
      isService: true,
    },
    {
      user: users.alice.value.getSnapshot(),
      markdown: `Hey @${
        users.bob.value.getSnapshot().nickname ?? ""
      }, this is ${users.alice.value.getSnapshot().nickname ?? ""}`,
      sent: new Date("December 6, 2022 13:47"),
      id: 9381,
      parent: 19,
      isService: false,
    },
    {
      user: users.bob.value.getSnapshot(),
      markdown: `Got ur message`,
      sent: new Date("December 6, 2022 13:48"),
      id: 9382,
      parent: 19,
      isService: false,
    },
  ],
  20: [
    {
      user: services.conversation,
      markdown: "!translation:dm_start",
      id: 5750,
      parent: 20,
      sent: new Date("December 6, 2022 13:47"),
      isService: true,
    },
    {
      user: users.eve.value.getSnapshot(),
      markdown: `You doing okay @${
        users.bob.value.getSnapshot().nickname ?? ""
      }?`,
      sent: new Date("December 6, 2022 13:47"),
      id: 1381,
      parent: 20,
      isService: false,
    },
    {
      user: users.bob.value.getSnapshot(),
      markdown: `Yeah, I'm fine`,
      sent: new Date("December 6, 2022 13:48"),
      id: 8382,
      parent: 20,
      isService: false,
    },
    {
      user: users.eve.value.getSnapshot(),
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
    members: [users.bob.value.getSnapshot(), users.alice.value.getSnapshot()],
    privacyLevel: PrivacyLevel.Unlisted,
    history: 10,
    dm: false,
    lastMessage: messages[5].at(-1),
  },
  3: {
    name: "Mock",
    description: "I'm going to mock you a bunch.",
    id: 3,
    members: [users.bob.value.getSnapshot(), users.alice.value.getSnapshot()],
    privacyLevel: PrivacyLevel.Private,
    history: 10,
    dm: false,
    lastMessage: messages[3].at(-1),
  },
  4: {
    name: "Hello World",
    description: "Place for people to say hello to their world a bunch.",
    id: 4,
    members: [users.alice.value.getSnapshot()],
    privacyLevel: PrivacyLevel.Public,
    history: 10,
    dm: false,
  },
  18: {
    name: "Bye World",
    description:
      "Place for people to bye hello to their world a bunch before they leave for Mars.",
    id: 18,
    members: [users.alice.value.getSnapshot()],
    privacyLevel: PrivacyLevel.Public,
    history: 10,
    dm: false,
  },
  19: {
    name: "",
    description: "",
    id: 19,
    members: [users.alice.value.getSnapshot(), users.bob.value.getSnapshot()],
    privacyLevel: PrivacyLevel.Private,
    history: 10,
    dm: true,
  },
  20: {
    name: "",
    description: "",
    id: 20,
    members: [users.eve.value.getSnapshot(), users.bob.value.getSnapshot()],
    privacyLevel: PrivacyLevel.Private,
    history: 10,
    dm: true,
  },
} satisfies Record<number, Channel>;

export const loggedInUser =
  users.bob as CleanDispatchableSubscribable<User | null>;
