import Entity from "../../libDatabase/Entity";
import RangeValidator from "../../libDatabase/validators/RangeValidator";
import Unique from "../../libDatabase/validators/Unique";

export default class Channel extends Entity {
  tableName = "channel";

  schema = {
    id: {
      type: "number" as const,
      autoAssign: true as const,
      primaryKey: true,
      validators: [new Unique()],
    },
    name: {
      type: "string" as const,
    },
    description: {
      type: "string" as const,
    },
    privacyLevel: {
      type: "number" as const,
      validators: [new RangeValidator(0, 2)],
    },
    isDm: {
      type: "boolean" as const,
    },
    password: {
      type: "string" as const,
      nullable: true as const,
    },
  };
}
