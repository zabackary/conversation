import Message from "./message";
import User, { UserId } from "./user";

export enum PrivacyLevel {
  Public,
  Unlisted,
  Private,
}

interface BaseChannel {
  members: User[];
  name: string;
  description: string;
  privacyLevel: PrivacyLevel;
  history: number;
  id: number;
  passphrase?: string;

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

export interface GroupChannel extends BaseChannel {
  dm: false;
  membersCanEdit: boolean;
  owner: UserId;
}

export interface DmChannel extends BaseChannel {
  dm: true;
  members: [User, User];
  name: "";
  description: "";
  privacyLevel: PrivacyLevel.Private;
}

type Channel = GroupChannel | DmChannel;
export default Channel;

export interface UnlistedChannel extends BaseChannel {
  privacyLevel: PrivacyLevel.Unlisted;
  key: string;
}

export type PublicChannelListing = Pick<
  BaseChannel,
  "name" | "description" | "id"
>;
