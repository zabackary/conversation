import {
  ApiSubscriptionArguments,
  ApiSubscriptionResponses,
  ApiSubscriptionType,
} from "../../shared/apiSubscriptions";
import { ConversationDatabaseHandle } from "../database";

type SubscriptionMap = {
  [Key in ApiSubscriptionType]: (
    arg: ApiSubscriptionArguments[Key]
  ) => ApiSubscriptionResponses[Key];
};

export default function getSubscriptionHandler<T extends ApiSubscriptionType>(
  database: ConversationDatabaseHandle,
  actionType: T,
  _enableBcrypt: () => void
): SubscriptionMap[T] {
  const map: SubscriptionMap = {
    [ApiSubscriptionType.NewMessage](_channelId) {
      throw new Error("Can't handle message subscription");
    },
    [ApiSubscriptionType.User](_userId) {
      throw new Error("Can't handle user subscription");
    },
  };
  return map[actionType];
}
