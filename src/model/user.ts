export enum UserStatus {
  Active,
  Inactive,
}

export default interface User {
  name: string;
  nickname: string;
  email: string;
  profilePicture: string | null;
  id: number;
  status: UserStatus;
}

export type NewUser = Pick<
  User,
  "email" | "name" | "nickname" | "profilePicture"
>;
