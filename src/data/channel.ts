import Message from "./message";
import User from "./user";

export enum PrivacyLevel {
  Public,
  Unlisted,
  Private,
}

export default interface Channel {
  members: User[];
  name: string;
  description: string;
  privacyLevel: PrivacyLevel;
  history: number;
  id: number;

  /**
   * The last message sent in the channel (used for preview). May be `undefined`
   */
  lastMessage?: Message;

  /**
   * Whether the channel is a dm or not. If so, `members` has length 2.
   * A user does not have a `DmChannel` with another user until the first
   * message is sent (for storage reasons)
   */
  dm: boolean;
}

export interface DmChannel extends Channel {
  dm: true;
  members: [User, User];
  name: "";
  description: "";
  privacyLevel: PrivacyLevel.Private;
}

export interface UnlistedChannel extends Channel {
  privacyLevel: PrivacyLevel.Unlisted;
  key: string;
}

export type PublicChannelListing = Pick<Channel, "name" | "description" | "id">;
