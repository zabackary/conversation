/* eslint-disable @typescript-eslint/no-shadow */
import User from "../model/user";

export enum ApiSubscriptionType {
  User,
}

export interface ApiSubscriptionArguments {
  [ApiSubscriptionType.User]: number;
}

export interface ApiSubscriptionResponses {
  [ApiSubscriptionType.User]: User;
}
