export type UserId = number | string;

export enum PrivilegeLevel {
  Unverified,
  Normal,
  Admin,
}

export interface BaseUser {
  name: string;
  /** If undefined, use the full name */
  nickname?: string;
  /** SSO means there might not be an email */
  email?: string;
  /** Show this on the user details page. */
  banner?: string;
  /** Can also be the bot's icon */
  profilePicture?: string;
  id: UserId;
  active?: boolean;
  privilegeLevel: PrivilegeLevel;
  isBot: boolean;
  status?: string;
}

export interface RegisteredUser extends BaseUser {
  isBot: false;
  tag?: string;
}

export interface BotUser extends BaseUser {
  isBot: true;
  nickname?: undefined;
  author?: RegisteredUser | UserId;
}

type User = RegisteredUser | BotUser;
export default User;

export interface NewUserMetadata {
  email: string;
  name?: string;
  nickname?: string;
  profilePicture?: string;
}
