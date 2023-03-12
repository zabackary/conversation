import {
  ApiSubscriptionArguments,
  ApiSubscriptionResponses,
  ApiSubscriptionType,
} from "../../shared/apiSubscriptions";
import { ConversationDatabaseHandle } from "../database";

type SubscriptionMap = {
  [Key in ApiSubscriptionType]: (
    lastChecked: Date,
    arg: ApiSubscriptionArguments[Key]
  ) => ApiSubscriptionResponses[Key] | null;
};

export default function getSubscriptionHandler<T extends ApiSubscriptionType>(
  database: ConversationDatabaseHandle,
  actionType: T,
  _enableBcrypt: () => void,
  currentUserId: number | null
): SubscriptionMap[T] {
  const map: SubscriptionMap = {
    [ApiSubscriptionType.NewMessage](_lastChecked, _channelId) {
      throw new Error("Can't handle message subscription");
    },
    [ApiSubscriptionType.User](lastChecked, userId) {
      const id = userId ?? currentUserId;
      if (id === null) throw new Error("Not logged in");
      const found = database
        .subscribe("user", id, lastChecked)
        ?.toSharedModel(database.getById.user);
      if (!found || !("status" in found))
        throw new Error("Cannot find user or user is Service");
      return found;
    },
  };
  return map[actionType];
}
