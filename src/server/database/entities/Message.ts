import Entity from "../../libDatabase/Entity";
import DateTimeValidator from "../../libDatabase/validators/DateTimeValidator";
import JsonValidator from "../../libDatabase/validators/JsonValidator";
import Unique from "../../libDatabase/validators/Unique";

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
      nullable: true as const,
    },
    attachments: {
      type: "string" as const,
      validators: [new JsonValidator()],
    },
    richParts: {
      type: "string" as const,
      nullable: true as const,
      validators: [new JsonValidator()],
    },
  };
}
