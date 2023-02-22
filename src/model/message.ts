import Service from "./service";
import User from "./user";

interface BaseMessage {
  user: User | Service;
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
   * anymore.
   */
  replied?: BaseMessage | MessageSnippet;
}

export interface UserMessage extends BaseMessage {
  user: User;
  isService: false;
}

export interface ServiceMessage extends BaseMessage {
  user: Service;
  rich?: unknown;
  isService: true;
}

type Message = UserMessage | ServiceMessage;
export default Message;

export interface MessageSnippet {
  user: User;
  markdownSnippet: string;
}
