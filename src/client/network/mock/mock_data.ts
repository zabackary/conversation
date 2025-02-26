import Channel, { PrivacyLevel } from "../../../model/channel";
import Message from "../../../model/message";
import User, { PrivilegeLevel, RegisteredUser } from "../../../model/user";
import { DispatchableSubscribable } from "../Subscribable";

export const services = {
  conversation: {
    name: "Conversation",
    profilePicture: "",
    banner: "",
    author: undefined,
    id: 98219,
    isBot: true,
    privilegeLevel: PrivilegeLevel.NORMAL,
    disabled: false,
  },
} satisfies Record<string, User>;

export const users = {
  bob: new DispatchableSubscribable<User>({
    name: "Bob Lastname",
    nickname: "Bob",
    email: "noreply+bob@stu.his.ac.jp",
    profilePicture: "https://www.w3schools.com/howto/img_avatar.png", // From w3schools
    id: 0,
    status: "Testing stuff",
    privilegeLevel: PrivilegeLevel.NORMAL,
    active: true,
    isBot: false,
    disabled: false,
  }),
  alice: new DispatchableSubscribable<User>({
    name: "Alice Surname",
    nickname: "Alice",
    email: "noreply+alice@stu.his.ac.jp",
    profilePicture: "https://www.w3schools.com/howto/img_avatar2.png", // From w3schools
    id: 1,
    privilegeLevel: PrivilegeLevel.NORMAL,
    active: false,
    isBot: false,
    disabled: false,
  }),
  eve: new DispatchableSubscribable<User>({
    name: "Eve Familyname",
    nickname: "Eve",
    email: "noreply+eve@stu.his.ac.jp",
    profilePicture: undefined, // None on purpose
    id: 2,
    privilegeLevel: PrivilegeLevel.NORMAL,
    active: true,
    isBot: false,
    disabled: false,
  }),
} satisfies Record<string, DispatchableSubscribable<User>>;

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
      attachments: [],
    },
    {
      user: users.bob.getSnapshot(),
      markdown: "This is *cool*.",
      sent: new Date("December 25, 2019 5:06"),
      id: 98,
      parent: 5,
      isService: false,
      attachments: [],
    },
    {
      user: services.conversation,
      markdown: `!translation:chat_member_add:${users.bob.getSnapshot().name}:${
        users.alice.getSnapshot().name
      }`,
      id: 9385,
      parent: 5,
      sent: new Date("December 25, 2019 5:06"),
      isService: true,
      attachments: [],
    },
    {
      user: users.alice.getSnapshot(),
      markdown: "Imagine _mocking_ your brother :D",
      sent: new Date("December 25, 2019 6:05"),
      id: 35,
      parent: 3,
      isService: false,
      attachments: [],
    },
    {
      user: users.alice.getSnapshot(),
      markdown: "@all What do you think of this app?",
      sent: new Date("January 1, 2020 4:48"),
      id: 22,
      parent: 5,
      isService: false,
      attachments: [],
    },
    {
      user: users.bob.getSnapshot(),
      markdown: "# Hello, world!\nJust checking this works :)",
      sent: new Date("January 1, 2020 5:05"),
      id: 97,
      parent: 5,
      isService: false,
      attachments: [],
    },
    {
      user: services.conversation,
      markdown: `!translation:chat_name_change:${
        users.bob.getSnapshot().name
      }:Hey.`,
      id: 9386,
      parent: 5,
      sent: new Date("January 1, 2020 5:09"),
      isService: true,
      attachments: [],
    },
    {
      user: users.alice.getSnapshot(),
      markdown: `Ok, thanks @${users.bob.getSnapshot().nickname ?? ""}`,
      sent: new Date("January 1, 2020 5:10"),
      id: 104,
      parent: 5,
      isService: false,
      attachments: [],
    },
    {
      user: users.alice.getSnapshot(),
      markdown: "How was your day today?",
      sent: new Date("January 3, 2020 2:05"),
      id: 938,
      parent: 5,
      isService: false,
      attachments: [],
    },
    {
      user: users.bob.getSnapshot(),
      markdown: "Oh, it was ~~good~~ *bad*",
      sent: new Date("January 3, 2020 2:06"),
      id: 939,
      parent: 5,
      isService: false,
      attachments: [],
    },
    {
      user: users.alice.getSnapshot(),
      markdown:
        "# Oh, I **see** now...\nWhat in the world did you eat for breakfast?",
      sent: new Date("January 3, 2020 2:07"),
      id: 263,
      parent: 5,
      isService: false,
      attachments: [],
    },
    {
      user: users.bob.getSnapshot(),
      markdown: "I ate a banana. アリスは？", // Test Japanese
      sent: new Date("January 3, 2020 2:08"),
      id: 265,
      parent: 5,
      isService: false,
      attachments: [],
    },
    {
      user: users.alice.getSnapshot(),
      markdown:
        "My house burned down so I didn't have any breakfast today.\n\n# Imagine",
      sent: new Date("January 3, 2020 2:09"),
      id: 268,
      parent: 5,
      isService: false,
      attachments: [],
    },
    {
      user: users.bob.getSnapshot(),
      markdown: "## 面白い",
      sent: new Date("January 3, 2020 2:10"),
      id: 269,
      parent: 5,
      isService: false,
      attachments: [],
    },
    {
      user: users.bob.getSnapshot(),
      markdown: "# spam",
      sent: new Date("January 3, 2020 2:11"),
      id: 270,
      parent: 5,
      isService: false,
      attachments: [],
    },
    {
      user: users.bob.getSnapshot(),
      markdown: "## spam",
      sent: new Date("January 3, 2020 2:11"),
      id: 271,
      parent: 5,
      isService: false,
      attachments: [],
    },
    {
      user: users.bob.getSnapshot(),
      markdown: "Spoiler:\n\n>! Someone *dies*.",
      sent: new Date("January 3, 2020 2:11"),
      id: 272,
      parent: 5,
      isService: false,
      attachments: [],
    },
    {
      user: users.alice.getSnapshot(),
      markdown:
        "longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong",
      sent: new Date("January 3, 2020 2:15"),
      id: 273,
      parent: 5,
      isService: false,
      attachments: [],
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
      attachments: [],
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
      attachments: [],
    },
    {
      user: users.alice.getSnapshot(),
      markdown: `Hey @${users.bob.getSnapshot().nickname ?? ""}, this is ${
        users.alice.getSnapshot().nickname ?? ""
      }`,
      sent: new Date("December 6, 2022 13:47"),
      id: 9381,
      parent: 19,
      isService: false,
      attachments: [],
    },
    {
      user: users.bob.getSnapshot(),
      markdown: `Got ur message`,
      sent: new Date("December 6, 2022 13:48"),
      id: 9382,
      parent: 19,
      isService: false,
      attachments: [],
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
      attachments: [],
    },
    {
      user: users.eve.getSnapshot(),
      markdown: `You doing okay @${users.bob.getSnapshot().nickname ?? ""}?`,
      sent: new Date("December 6, 2022 13:47"),
      id: 1381,
      parent: 20,
      isService: false,
      attachments: [],
    },
    {
      user: users.bob.getSnapshot(),
      markdown: `Yeah, I'm fine`,
      sent: new Date("December 6, 2022 13:48"),
      id: 8382,
      parent: 20,
      isService: false,
      attachments: [],
    },
    {
      user: users.eve.getSnapshot(),
      markdown: `Just checking`,
      sent: new Date("December 6, 2022 13:49"),
      id: 8383,
      parent: 20,
      isService: false,
      attachments: [],
    },
  ],
} satisfies Record<number, Message[]>;

export const channels = {
  5: {
    name: "Hey",
    description: "Say hey to one another here.",
    id: 5,
    members: [users.bob.getSnapshot(), users.alice.getSnapshot()],
    privacyLevel: PrivacyLevel.UNLISTED,
    history: 10,
    dm: false,
    lastMessage: messages[5].at(-1),
    membersCanEdit: false,
    owner: users.alice.getSnapshot().id,
  },
  3: {
    name: "Mock",
    description: "I'm going to mock you a bunch.",
    id: 3,
    members: [users.bob.getSnapshot(), users.alice.getSnapshot()],
    privacyLevel: PrivacyLevel.PRIVATE,
    history: 10,
    dm: false,
    lastMessage: messages[3].at(-1),
    membersCanEdit: false,
    owner: users.bob.getSnapshot().id,
  },
  4: {
    name: "Hello World",
    description: "Place for people to say hello to their world a bunch.",
    id: 4,
    members: [users.alice.getSnapshot()],
    privacyLevel: PrivacyLevel.PUBLIC,
    history: 10,
    dm: false,
    membersCanEdit: true,
    owner: users.alice.getSnapshot().id,
  },
  18: {
    name: "Bye World",
    description:
      "Place for people to bye hello to their world a bunch before they leave for Mars.",
    id: 18,
    members: [users.alice.getSnapshot()],
    privacyLevel: PrivacyLevel.PUBLIC,
    history: 10,
    dm: false,
    membersCanEdit: true,
    owner: users.alice.getSnapshot().id,
  },
  19: {
    name: "",
    description: "",
    id: 19,
    members: [users.alice.getSnapshot(), users.bob.getSnapshot()],
    privacyLevel: PrivacyLevel.PRIVATE,
    history: 10,
    dm: true,
  },
  20: {
    name: "",
    description: "",
    id: 20,
    members: [users.eve.getSnapshot(), users.bob.getSnapshot()],
    privacyLevel: PrivacyLevel.PRIVATE,
    history: 10,
    dm: true,
  },
} satisfies Record<number, Channel>;

export const loggedInUser =
  users.bob as DispatchableSubscribable<RegisteredUser | null>;
