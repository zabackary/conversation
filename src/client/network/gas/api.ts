import { v4 as uuidv4 } from "uuid";
import type { ServerGlobals } from "../../../server";
import { ApiActionArguments, ApiActionType } from "../../../shared/apiActions";
import {
  ApiSubscriptionArguments,
  ApiSubscriptionResponses,
  ApiSubscriptionType,
} from "../../../shared/apiSubscriptions";
import {
  ApiActionRequest,
  ApiActionResponse,
  ApiSubscriptionRequest,
  ApiSubscriptionResponse,
} from "../../../shared/apiTypes";

type Subscribable<T extends ApiSubscriptionType> = [
  string,
  ApiSubscriptionRequest<T>,
  (response: ApiSubscriptionResponse<T>) => void
];
type Action<T extends ApiActionType> = [
  string,
  ApiActionRequest<T>,
  (response: ApiActionResponse<T>) => void
];

export default class ApiManager {
  private intervalId: number | undefined;

  private subscriptions: Subscribable<ApiSubscriptionType>[] = [];

  private pendingActions: Action<ApiActionType>[] = [];

  private clientId: string | undefined;

  private token: string | undefined;

  private constructor() {
    if (!("google" in window && "script" in window.google)) {
      throw new Error("Page not in Google Script iframe context");
    }
  }

  private runAsync<T extends keyof ServerGlobals>(
    methodName: T,
    ...methodArgs: Parameters<ServerGlobals[T]>
  ) {
    return new Promise<ReturnType<ServerGlobals[T]>>((resolve, reject) => {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        [methodName](...methodArgs);
    });
  }

  beginPooling(interval = 1000) {
    window.clearInterval(this.intervalId);
    this.intervalId = window.setInterval(() => {
      this.dispatchPooled();
    }, interval);
  }

  async dispatchPooled() {
    const actions: Record<string, Action<ApiActionType>[1]> = {};
    const subscriptions: Record<string, Subscribable<ApiSubscriptionType>[1]> =
      {};
    const actionCallbacks: Record<string, Action<ApiActionType>[2]> = {};
    const subscriptionCallbacks: Record<
      string,
      Subscribable<ApiSubscriptionType>[2]
    > = {};
    for (const subscription of this.subscriptions) {
      [, subscriptions[subscription[0]]] = subscription;
      [, , subscriptionCallbacks[subscription[0]]] = subscription;
    }
    for (const action of this.pendingActions) {
      [, actions[action[0]]] = action;
      [, , actionCallbacks[action[0]]] = action;
    }
    this.pendingActions = [];
    const response = await this.runAsync("apiCall", {
      actions,
      subscriptions,
      requestTime: new Date().getTime(),
      clientId: this.clientId,
      token: this.token,
      userAgent: navigator.doNotTrack ? "DNT" : navigator.userAgent,
    });
    if (response.newClientId) this.clientId = response.newClientId;
    Object.entries(response.actions).forEach(([id, actionResponse]) => {
      actionCallbacks[id](actionResponse);
    });
    Object.entries(response.subscriptions).forEach(
      ([id, subscriptionCallback]) => {
        this.subscriptions[
          this.subscriptions.findIndex((sub) => sub[0] === id)
        ][1].lastCheck = subscriptionCallback.checked;
        subscriptionCallbacks[id](subscriptionCallback);
      }
    );
  }

  addSubscription<T extends ApiSubscriptionType>(
    type: T,
    arg: ApiSubscriptionArguments[T],
    callback: (response: ApiSubscriptionResponses[T]) => void
  ) {
    const id = uuidv4();
    this.subscriptions.push([
      id,
      {
        type,
        arg,
        lastCheck: 0,
      },
      (response) => {
        if (response.error) console.error(response.error);
        // Hi me! If something went wrong, here it is. The server returns type
        // `any` but I've casted it to the correct type, voiding the type
        // safety. Sorry for any trouble I've caused you in the future!
        if (response.response)
          callback(response.response as Parameters<typeof callback>[0]);
      },
    ]);
    return () => {
      this.subscriptions.splice(
        this.subscriptions.findIndex(([subId]) => subId === id),
        1
      );
    };
  }

  runAction<T extends ApiActionType>(type: T, arg: ApiActionArguments[T]) {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      this.pendingActions.push([
        id,
        {
          type,
          arg,
        },
        (response) => {
          if (response.error) reject(response.error);
          else if (response.response) resolve(response.response);
        },
      ]);
    });
  }

  private static instance: ApiManager | null = null;

  static getInstance() {
    // eslint-disable-next-line no-return-assign
    return this.instance || (this.instance = new ApiManager());
  }
}
