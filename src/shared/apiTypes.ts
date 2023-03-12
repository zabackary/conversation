/* eslint-disable @typescript-eslint/no-shadow */
import {
  ApiActionArguments,
  ApiActionResponses,
  ApiActionType,
} from "./apiActions";
import {
  ApiSubscriptionArguments,
  ApiSubscriptionResponses,
  ApiSubscriptionType,
} from "./apiSubscriptions";

export interface ApiRequestPayload {
  token?: string;
  subscriptions: Record<string, ApiSubscriptionRequest<ApiSubscriptionType>>;
  actions: Record<string, ApiActionRequest<ApiActionType>>;
  requestTime: number;
  userAgent: string;
}

export interface ApiResponsePayload {
  subscriptions: Record<string, ApiSubscriptionResponse<ApiSubscriptionType>>;
  actions: Record<string, ApiActionResponse<ApiActionType>>;
}

export interface ApiSubscriptionRequest<T extends ApiSubscriptionType> {
  type: T;
  arg: ApiSubscriptionArguments[T];
  lastCheck: number;
}

export interface ApiSubscriptionResponse<T extends ApiSubscriptionType> {
  response?: ApiSubscriptionResponses[T];
  error?: ApiError;
  checked: number;
}

export interface ApiActionRequest<T extends ApiActionType> {
  type: T;
  arg: ApiActionArguments[T];
}

export interface ApiActionResponse<T extends ApiActionType> {
  response?: ApiActionResponses[T];
  error?: ApiError;
}

export interface ApiError {
  name: string;
  description: string;
  meta: string;
}
