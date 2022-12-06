export enum UserStatus {
  Active,
  Inactive,
}

export default interface User {
  name: string;
  nickname: string;
  email: string;
  profilePicture: string;
  id: number;
  status: UserStatus;
}
