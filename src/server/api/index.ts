import { setRandomFallback } from "bcryptjs";
import { ApiActionArguments, ApiActionType } from "../../shared/apiActions";
import {
  ApiActionResponse,
  ApiRequestPayload,
  ApiResponsePayload,
} from "../../shared/apiTypes";
import getDatabaseHandle from "../database";
import { random } from "../isaac";
import getActionHandler from "./actions";

export default function apiCall(
  payload: ApiRequestPayload
): ApiResponsePayload {
  setRandomFallback((length) => Array.from(new Array(length), () => random()));

  const database = getDatabaseHandle();

  if (Object.keys(payload.subscriptions).length > 0) {
    throw new Error("Backend can't handle subscriptions just yet.");
  }
  const actions: ApiResponsePayload["actions"] = {};
  for (const [actionId, action] of Object.entries(payload.actions)) {
    actions[actionId] = (
      getActionHandler(database, action.type) as (
        arg: ApiActionArguments[ApiActionType]
      ) => ApiActionResponse<ApiActionType>
    )(action.arg);
  }

  database.flush();

  return {
    actions,
    subscriptions: {},
  };
}
