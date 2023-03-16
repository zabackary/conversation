import { setRandomFallback } from "bcryptjs";
import normalizeException from "normalize-exception";
import jwtPrivateKey from "../../../jwt.key?raw";
import { ApiActionArguments, ApiActionType } from "../../shared/apiActions";
import {
  ApiSubscriptionArguments,
  ApiSubscriptionType,
} from "../../shared/apiSubscriptions";
import {
  ApiActionResponse,
  ApiRequestPayload,
  ApiResponsePayload,
  ApiSubscriptionResponse,
} from "../../shared/apiTypes";
import getDatabaseHandle from "../database";
import { readJWT } from "../utils";
import getActionHandler from "./actions";
import getSubscriptionHandler from "./subscriptions";

export default function apiCall(
  payload: ApiRequestPayload
): ApiResponsePayload {
  let last = new Date();
  const logTime = (tag = "default") => {
    console.log(`+${new Date().getTime() - last.getTime()}ms - ${tag}`);
    last = new Date();
  };

  let bcryptEnabled = false;
  const enableBcrypt = () => {
    if (bcryptEnabled) return;
    // TODO: Add a better secure, random algorithm
    setRandomFallback((length) =>
      Array.from(new Array(length), () => Math.random() * 0x100000000)
    );
    bcryptEnabled = true;
  };

  const userId = payload.token
    ? Number(readJWT(payload.token, jwtPrivateKey).sub)
    : null;
  if (Number.isNaN(userId)) throw new Error("userId isn't a number");

  const database = getDatabaseHandle();
  logTime("opened database");

  const subscriptions: ApiResponsePayload["subscriptions"] = {};
  for (const [subscriptionId, subscription] of Object.entries(
    payload.subscriptions
  )) {
    try {
      subscriptions[subscriptionId] = {
        response:
          (
            getSubscriptionHandler(
              database,
              subscription.type,
              enableBcrypt,
              userId
            ) as (
              lastChecked: Date,
              arg: ApiSubscriptionArguments[ApiSubscriptionType]
            ) => ApiSubscriptionResponse<ApiSubscriptionType>["response"] | null
          )(new Date(subscription.lastCheck), subscription.arg) ?? undefined,
        checked: new Date().getTime(),
      };
      logTime(
        `ran subscription: ${subscriptionId} ${
          subscription.type
        } ${JSON.stringify(subscription.arg)}`
      );
    } catch (e) {
      console.warn(`subscription failed:`);
      console.error(e);
      const normalizedError = normalizeException(e);
      subscriptions[subscriptionId] = {
        checked: -1,
        error: {
          name: normalizedError.name,
          description: normalizedError.message,
          meta: `Stack: ${
            normalizedError.stack ?? "undefined"
          }\nDate: ${new Date().toISOString()}`,
        },
      };
    }
  }
  const actions: ApiResponsePayload["actions"] = {};
  for (const [actionId, action] of Object.entries(payload.actions)) {
    try {
      actions[actionId] = {
        response: (
          getActionHandler(database, action.type, enableBcrypt, userId) as (
            arg: ApiActionArguments[ApiActionType]
          ) => ApiActionResponse<ApiActionType>["response"]
        )(action.arg),
      };
      logTime(
        `ran action: ${actionId} ${action.type} ${JSON.stringify(action.arg)}`
      );
    } catch (e) {
      console.warn(`action failed:`);
      console.error(e);
      const normalizedError = normalizeException(e);
      actions[actionId] = {
        error: {
          name: normalizedError.name,
          description: normalizedError.message,
          meta: `Stack: ${
            normalizedError.stack ?? "undefined"
          }\nDate: ${new Date().toISOString()}`,
        },
      };
    }
  }

  return {
    actions,
    subscriptions,
  };
}
