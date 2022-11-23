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
    sent: new Date("January 1st, 2020 5:06pm"),
    id: 98,
    parent: 5,
  },
  mock: {
    user: users.alice,
    markdown: "Imagine _mocking_ your brother :D",
    sent: new Date("March 25st, 2021 3:06pm"),
    id: 35,
    parent: 3,
  },
  rate: {
    user: users.alice,
    markdown: "@all What do you think of this app?",
    sent: new Date("January 1st, 2020 4:48pm"),
    id: 22,
    parent: 5,
  },
  hello: {
    user: users.bob,
    markdown: "# Hello, world!\nJust checking this works :)",
    sent: new Date("January 1st, 2020 5:05pm"),
    id: 97,
    parent: 5,
  },
  thanks: {
    user: users.alice,
    markdown: `Ok, thanks @${users.bob.nickname}`,
    sent: new Date("January 1st, 2020 5:10pm"),
    id: 104,
    parent: 5,
  },
};
