/* eslint-disable @typescript-eslint/no-shadow */
import Message from "../model/message";
import User from "../model/user";

export enum ApiSubscriptionType {
  User,
  NewMessage,
}

export interface ApiSubscriptionArguments {
  [ApiSubscriptionType.User]: number | null;
  [ApiSubscriptionType.NewMessage]: number;
}

export interface ApiSubscriptionResponses {
  [ApiSubscriptionType.User]: User;
  [ApiSubscriptionType.NewMessage]: Message[];
}
