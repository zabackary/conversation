import { ApiRequestPayload, ApiResponsePayload } from "../../shared/apiTypes";

export default function apiCall(
  payload: ApiRequestPayload
): ApiResponsePayload {
  // payload.clientId
  // SpreadsheetApp.openById
  SpreadsheetApp.flush();
  throw new Error("Can't make API calls yet!");
}
