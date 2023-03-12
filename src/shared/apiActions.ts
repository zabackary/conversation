/* eslint-disable @typescript-eslint/no-shadow */
import User, { NewUser } from "../model/user";

export enum ApiActionType {
  LogIn,
  LogOut,
  CreateAccount,
}

export interface ApiActionArguments {
  [ApiActionType.LogIn]: {
    email: string;
    password: string;
  };
  [ApiActionType.LogOut]: null;
  [ApiActionType.CreateAccount]: NewUser & { password: string };
}

export interface ApiActionResponses {
  /**
   * Indicates whether the email/password were valid, with a `string` holding a
   * JWT if success.
   */
  [ApiActionType.LogIn]: string | null;

  /**
   * Indicates whether the logout succeeded.
   */
  [ApiActionType.LogOut]: boolean;

  /**
   * Indicates the new user, or `null` on failure.
   */
  [ApiActionType.CreateAccount]: User | null;
}
