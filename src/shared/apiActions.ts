/* eslint-disable @typescript-eslint/no-shadow */

export enum ApiActionType {
  LogIn,
  LogOut,
}

export interface ApiActionArguments {
  [ApiActionType.LogIn]: {
    email: string;
    password: string;
  };
  [ApiActionType.LogOut]: null;
}

export interface ApiActionResponses {
  /**
   * Indicates whether the email/password were valid.
   */
  [ApiActionType.LogIn]: boolean;

  /**
   * Indicates whether the logout succeeded.
   */
  [ApiActionType.LogOut]: boolean;
}
