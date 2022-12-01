import Message from "../../data/message";
import User from "../../data/user";

export const users: Record<string, User> = {
  bob: {
    name: "Bob Lastname",
    nickname: "Bob",
    email: "bob@example.com",
    profilePicture: "https://www.w3schools.com/howto/img_avatar.png", // From w3schools
    id: 0,
  },
  alice: {
    name: "Alice Surname",
    nickname: "Alice",
    email: "alice@example.com",
    profilePicture: "https://www.w3schools.com/howto/img_avatar2.png", // From w3schools
    id: 1,
  },
};
export const messages: Record<string, Message> = {
  cool: {
    user: users.bob,
    markdown: "This is *cool*.",
    sent: new Date("January 1, 2020 5:06"),
    id: 98,
    parent: 5,
  },
  mock: {
    user: users.alice,
    markdown: "Imagine _mocking_ your brother :D",
    sent: new Date("March 25, 2021 3:06"),
    id: 35,
    parent: 3,
  },
  rate: {
    user: users.alice,
    markdown: "@all What do you think of this app?",
    sent: new Date("January 1, 2020 4:48"),
    id: 22,
    parent: 5,
  },
  hello: {
    user: users.bob,
    markdown: "# Hello, world!\nJust checking this works :)",
    sent: new Date("January 1, 2020 5:05"),
    id: 97,
    parent: 5,
  },
  thanks: {
    user: users.alice,
    markdown: `Ok, thanks @${users.bob.nickname}`,
    sent: new Date("January 1, 2020 5:10"),
    id: 104,
    parent: 5,
  },
  how_day: {
    user: users.alice,
    markdown: "How was your day today?",
    sent: new Date("January 3, 2020 2:05"),
    id: 938,
    parent: 5,
  },
  good_day: {
    user: users.bob,
    markdown: "Oh, it was ~~good~~ *bad*",
    sent: new Date("January 3, 2020 2:06"),
    id: 939,
    parent: 5,
  },
  oh_see: {
    user: users.alice,
    markdown:
      "# Oh, I **see** now...\nWhat in the world did you eat for breakfast?",
    sent: new Date("January 3, 2020 2:07"),
    id: 263,
    parent: 5,
  },
  banana: {
    user: users.bob,
    markdown: "I ate a banana. アリスは？", // Test Japanese
    sent: new Date("January 3, 2020 2:08"),
    id: 265,
    parent: 5,
  },
  no_breakfast: {
    user: users.alice,
    markdown:
      "My house burned down so I didn't have any breakfast today.\n\n# Imagine",
    sent: new Date("January 3, 2020 2:09"),
    id: 268,
    parent: 5,
  },
  面白い: {
    user: users.bob,
    markdown: "## 面白い",
    sent: new Date("January 3, 2020 2:10"),
    id: 269,
    parent: 5,
  },
  spam1: {
    user: users.bob,
    markdown: "## spam",
    sent: new Date("January 3, 2020 2:11"),
    id: 270,
    parent: 5,
  },
  spam2: {
    user: users.bob,
    markdown: "## spam",
    sent: new Date("January 3, 2020 2:11"),
    id: 271,
    parent: 5,
  },
  spam3: {
    user: users.bob,
    markdown: "spam",
    sent: new Date("January 3, 2020 2:11"),
    id: 272,
    parent: 5,
  },
};
