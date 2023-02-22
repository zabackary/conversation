import SharedModelMessage from "../../../model/message";
import SharedModelService from "../../../model/service";
import SharedModelUser from "../../../model/user";
import Entity from "../../libDatabase/Entity";
import DateTimeValidator from "../../libDatabase/validators/DateTimeValidator";
import JsonValidator from "../../libDatabase/validators/JsonValidator";
import Unique from "../../libDatabase/validators/Unique";
import User from "./User";

function isUserService(
  user: SharedModelUser | SharedModelService
): user is SharedModelService {
  return "owner" in user;
}

export default class Message extends Entity {
  tableName = "message";

  schema = {
    id: {
      type: "number" as const,
      autoAssign: true as const,
      primaryKey: true,
      validators: [new Unique()],
    },
    userId: {
      type: "number" as const,
      foreignKey: "user.id",
    },
    channelId: {
      type: "number" as const,
      foreignKey: "channel.id",
    },
    dateTime: {
      type: "string" as const,
      validators: [new DateTimeValidator()],
    },
    replying: {
      type: "number" as const,
      foreignKey: "message.id",
    },
    markdown: {
      type: "string" as const,
    },
    attachments: {
      type: "string" as const,
      validators: [new JsonValidator()],
    },
    rich: {
      type: "string" as const,
      nullable: true as const,
      validators: [new JsonValidator()],
    },
  };

  toSharedModel(userFromId: (id: number) => User): SharedModelMessage {
    if (this.rowNumber === null)
      throw new Error("Cannot serilize when rowNumber is unset");
    const { properties } = this;
    const user = userFromId(properties.userId as number).toSharedModel(
      userFromId
    );
    if (isUserService(user)) {
      return {
        isService: true,
        user,
        parent: properties.channelId as number,
        id: properties.id as number,
        sent: DateTimeValidator.toDate(properties.dateTime as string),
        markdown: properties.markdown as string,
      };
    }
    return {
      isService: false,
      user,
      parent: properties.channelId as number,
      id: properties.id as number,
      sent: DateTimeValidator.toDate(properties.dateTime as string),
      markdown: properties.markdown as string,
    };
  }
}
