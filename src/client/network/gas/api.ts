import { v4 as uuidv4 } from "uuid";
import type { ServerGlobals } from "../../../server";
import {
  ApiActionArguments,
  ApiActionResponses,
  ApiActionType,
} from "../../../shared/apiActions";
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

type Subscribable<T extends ApiSubscriptionType> = {
  request: ApiSubscriptionRequest<T>;
  listeners: {
    id: string;
    callback: (response: ApiSubscriptionResponse<T>) => void;
  }[];
};

type Action<T extends ApiActionType> = {
  request: ApiActionRequest<T>;
  listener: { id: string; callback: (response: ApiActionResponse<T>) => void };
};

export default class ApiManager {
  private intervalId: number | undefined;

  private subscriptions: Record<string, Subscribable<ApiSubscriptionType>> = {};

  private pendingActions: Record<string, Action<ApiActionType>> = {};

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

  setToken(newToken: string) {
    this.token = newToken;
  }

  beginPooling(interval = 1000) {
    window.clearInterval(this.intervalId);
    this.intervalId = window.setInterval(() => {
      void this.dispatchPooled();
    }, interval);
  }

  async dispatchPooled() {
    const actions = this.pendingActions;
    this.pendingActions = {};
    const response = await this.runAsync("apiCall", {
      actions: Object.fromEntries(
        Object.entries(actions).map(([k, v]) => [k, v.request])
      ),
      subscriptions: Object.fromEntries(
        Object.entries(this.subscriptions).map(([k, v]) => [k, v.request])
      ),
      requestTime: new Date().getTime(),
      token: this.token,
      userAgent: navigator.doNotTrack ? "DNT" : navigator.userAgent,
    });
    Object.entries(response.actions).forEach(([id, actionResponse]) => {
      actions[id].listener.callback(actionResponse);
    });
    Object.entries(response.subscriptions).forEach(
      ([id, subscriptionCallback]) => {
        if (!(id in this.subscriptions))
          console.warn(
            "Recieved response from server but subscription was canceled."
          );
        if (subscriptionCallback.error)
          console.error(subscriptionCallback.error);
        this.subscriptions[id].request.lastCheck = subscriptionCallback.checked;
        this.subscriptions[id].listeners.forEach((listener) =>
          listener.callback(subscriptionCallback)
        );
      }
    );
  }

  addSubscription<T extends ApiSubscriptionType>(
    type: T,
    arg: ApiSubscriptionArguments[T],
    callback: (response: ApiSubscriptionResponses[T]) => void
  ) {
    const id = uuidv4();
    const processResponse = (
      response: ApiSubscriptionResponse<ApiSubscriptionType>
    ) => {
      console.log(`[\u27F3] ${id} =>`, response);
      // Hi me! If something went wrong, here it is. The server returns type
      // `any` but I've casted it to the correct type, voiding the type
      // safety. Sorry for any trouble I've caused you in the future!
      if (response.response)
        callback(response.response as Parameters<typeof callback>[0]);
    };
    console.log(`[\u27F3] ${type}(${JSON.stringify(arg)}) +${id.slice(0, 5)}`);
    const sameSub = Object.entries(this.subscriptions).find(
      ([_id, { request }]) => request.type === type && request.arg === arg
    )?.[0];
    if (sameSub) {
      this.subscriptions[sameSub].listeners.push({
        id,
        callback: processResponse,
      });
    } else {
      this.subscriptions[id] = {
        request: {
          type,
          arg,
          lastCheck: 0,
        },
        listeners: [
          {
            id,
            callback: processResponse,
          },
        ],
      };
    }
    return () => {
      const foundId = Object.entries(this.subscriptions).find(
        ([_id, { listeners }]) =>
          !!listeners.find((listener) => listener.id === id)
      )?.[0];
      if (!foundId) {
        console.warn("Can't find request.");
        return;
      }
      this.subscriptions[foundId].listeners.splice(
        this.subscriptions[foundId].listeners.findIndex(
          ({ id: subId }) => subId === id
        ),
        1
      );
    };
  }

  runAction<T extends ApiActionType>(type: T, arg: ApiActionArguments[T]) {
    return new Promise<ApiActionResponses[T]>((resolve, reject) => {
      const id = uuidv4();
      console.log(`[\u2192] ${type}(${JSON.stringify(arg)}) +${id}`);
      this.pendingActions[id] = {
        listener: {
          id,
          callback(response) {
            console.log(`[\u2192] ${id} =>`, response);
            if ("error" in response) reject(response.error);
            else if ("response" in response)
              resolve(response.response as ApiActionResponses[T]);
          },
        },
        request: {
          type,
          arg,
        },
      };
    });
  }

  private static instance: ApiManager | null = null;

  static getInstance() {
    // eslint-disable-next-line no-return-assign
    return this.instance || (this.instance = new ApiManager());
  }
}
