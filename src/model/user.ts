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
  profilePicture: string | null;
  id: number;
  status: UserStatus;
  state: UserState;
}

export type NewUser = Pick<
  User,
  "email" | "name" | "nickname" | "profilePicture"
>;
