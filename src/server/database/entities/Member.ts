import Entity from "../../libDatabase/Entity";
import DateTimeValidator from "../../libDatabase/validators/DateTimeValidator";
import Unique from "../../libDatabase/validators/Unique";

export default class Member extends Entity {
  tableName = "member";

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
    lastView: {
      type: "string" as const,
      nullable: true as const,
      validators: [new DateTimeValidator()],
    },
    inviteMessage: {
      type: "string" as const,
      nullable: true as const,
    },
  };
}
