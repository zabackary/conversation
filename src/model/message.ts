import User from "./user";

export default interface Message {
  user: User;
  parent: number;
  id: number;
  sent: Date;
  isService: boolean;
  markdown: string;
  attachments?: string[];
  images?: string[];

  /**
   * The message this message is replying to, if any. May also be a
   * `MessageSnippet` if the original message is not in the channel's history
   * anymore, or `null` if the message is "not avalible anymore"
   */
  replied?: Message | MessageSnippet | null;
}

export interface MessageSnippet {
  user: User;
  markdownSnippet: string;
}
