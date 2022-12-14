import Service from "./service";
import User from "./user";

interface BaseMessage {
  user: User | Service;
  parent: number;
  id: number;
  sent: Date;
  isService: boolean;

  /**
   * The message this message is replying to, if any. May also be a
   * `MessageSnippet` if the original message is not in the channel's history
   * anymore.
   */
  replied?: BaseMessage | MessageSnippet;
}

export interface UserMessage extends BaseMessage {
  user: User;
  markdown: string;
  isService: false;
  attachments?: string[];
  images?: string[];
}

export enum ServiceMessageFormat {
  Card,
  Message,
  Caption,
}

export type ServiceMessageInteractive = unknown;

export enum ServiceMessageBuiltInIcon {
  Flag,
  PersonAdd,
  Edit,
}

export interface ServiceMessage extends BaseMessage {
  user: Service;
  format: ServiceMessageFormat;
  title: string;
  subheader?: string;
  icon?: string | ServiceMessageBuiltInIcon;
  interactive?: ServiceMessageInteractive;
  isService: true;
}

type Message = UserMessage | ServiceMessage;
export default Message;

export interface MessageSnippet {
  user: User;
  markdownSnippet: string;
}
