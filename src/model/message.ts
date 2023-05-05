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
   * The message this message is replying to, if any.
   */
  replied?: Message["id"];
}
