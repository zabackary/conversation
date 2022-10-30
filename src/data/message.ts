import User from "./user";

export default interface Message {
  user: User;
  markdown: string;
  sent: Date;
  id: number;
  parent: number;

  /**
   * The message this message is replying to, if any. May also be a
   * `MessageSnippet` if the original message is not in the channel's history
   * anymore.
   */
  replied?: Message | MessageSnippet;
}

export interface MessageSnippet {
  user: User;
  markdownSnippet: string;
}
