import Message from "../../data/message";

export const users = {
  zachary: {
    name: "Zachary Cheng",
    nickname: "Zachary",
    email: "zacharycheng@stu.his.ac.jp",
    profilePicture: "https://www.w3schools.com/howto/img_avatar.png", // From w3schools
    id: 0,
  },
  jeremy: {
    name: "Jeremy Cheng",
    nickname: "Jeremy",
    email: "jeremycheng@stu.his.ac.jp",
    profilePicture: "https://www.w3schools.com/howto/img_avatar.png", // From w3schools
    id: 1,
  },
};
export const messages: Record<string, Message> = {
  cool: {
    user: users.zachary,
    markdown: "This is *cool*.",
    sent: new Date("January 1st, 2020 5:06pm"),
    id: 98,
    parent: 5,
  },
  mock: {
    user: users.jeremy,
    markdown: "Imagine _mocking_ your brother :D",
    sent: new Date("March 25st, 2021 3:06pm"),
    id: 35,
    parent: 3,
  },
  rate: {
    user: users.jeremy,
    markdown: "@all What do you think of this app?",
    sent: new Date("January 1st, 2020 4:48pm"),
    id: 22,
    parent: 5,
  },
};
