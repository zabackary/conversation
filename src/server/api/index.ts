import { setRandomFallback } from "bcryptjs";
import normalizeException from "normalize-exception";
import { ApiActionArguments, ApiActionType } from "../../shared/apiActions";
import {
  ApiActionResponse,
  ApiRequestPayload,
  ApiResponsePayload,
} from "../../shared/apiTypes";
import getDatabaseHandle from "../database";
import getActionHandler from "./actions";

const ISAAC_SEED_LENGTH = 10;

export default function apiCall(
  payload: ApiRequestPayload
): ApiResponsePayload {
  try {
    let bcryptEnabled = false;
    const enableBcrypt = () => {
      if (bcryptEnabled) return;
      setRandomFallback((length) =>
        Array.from(new Array(length), () => Math.random() * 0x100000000)
      );
      bcryptEnabled = true;
    };

    const database = getDatabaseHandle();

    /* if (Object.keys(payload.subscriptions).length > 0) {
    throw new Error("Backend can't handle subscriptions just yet.");
  } */
    const actions: ApiResponsePayload["actions"] = {};
    for (const [actionId, action] of Object.entries(payload.actions)) {
      try {
        actions[actionId] = {
          response: (
            getActionHandler(database, action.type, enableBcrypt) as (
              arg: ApiActionArguments[ApiActionType]
            ) => ApiActionResponse<ApiActionType>["response"]
          )(action.arg),
        };
      } catch (e) {
        const normalizedError = normalizeException(e);
        actions[actionId] = {
          error: {
            name: normalizedError.name,
            description: normalizedError.message,
            meta: `Stack: ${normalizedError.stack}\nDate: ${new Date()}`,
          },
        };
      }
    }

    database.flush();

    return {
      actions,
      subscriptions: {},
    };
  } catch (e) {
    console.error(">> Failure!");
    throw e;
  }
}
