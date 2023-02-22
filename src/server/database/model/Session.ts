import Entity from "../../libDatabase/Entity";
import DateTimeValidator from "../../libDatabase/validators/DateTimeValidator";
import Unique from "../../libDatabase/validators/Unique";

export default class Session extends Entity {
  tableName = "session";

  schema = {
    id: {
      type: "number" as const,
      autoAssign: true as const,
      primaryKey: true,
      validators: [new Unique()],
    },
    userId: {
      type: "number" as const,
      nullable: true as const,
      foreignKey: "user.id",
    },
    createdTime: {
      type: "string" as const,
      autoAssign: true as const,
      validators: [new DateTimeValidator()],
    },
    userAgent: {
      type: "string" as const,
      nullable: true as const,
    },
    token: {
      type: "string" as const,
      nullable: true as const,
    },
    stale: {
      type: "boolean" as const,
    },
  };
}
