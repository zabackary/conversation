export enum UserStatus {
  Active,
  Inactive,
}

export enum UserState {
  Unverified,
  Normal,
  Admin,
}

export default interface User {
  name: string;
  nickname: string;
  email: string;
  banner: string | null; // TODO: Same as below
  profilePicture: string | null; // TODO: convert to ? type
  id: number | string;
  status: UserStatus;
  state: UserState;
  isBot?: boolean;
}

export type NewUser = Pick<
  User,
  "email" | "name" | "nickname" | "profilePicture"
>;
