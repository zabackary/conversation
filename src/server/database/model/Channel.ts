import SharedModelChannel, {
  DmChannel,
  GroupChannel,
  PrivacyLevel,
} from "../../../model/channel";
import SharedModelUser from "../../../model/user";
import Entity from "../../libDatabase/Entity";
import RangeValidator from "../../libDatabase/validators/RangeValidator";
import Unique from "../../libDatabase/validators/Unique";
import User from "./User";

function privacyLevelToShared(privacyLevel: number) {
  switch (privacyLevel) {
    case 0:
      return PrivacyLevel.Public;
    case 1:
      return PrivacyLevel.Unlisted;
    case 2:
    default:
      return PrivacyLevel.Private;
  }
}

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

  toSharedModel(
    members: User[],
    userFromId: (id: number) => User
  ): SharedModelChannel {
    if (this.rowNumber === null)
      throw new Error("Cannot serilize when rowNumber is unset");
    const { properties } = this;
    const sharedModelMembers = members
      .map((member) => member.toSharedModel(userFromId))
      .filter((member): member is SharedModelUser => !("auto" in member));
    if (properties.isDm) {
      return {
        dm: true,
        members: [sharedModelMembers[0], sharedModelMembers[1]],
        name: "",
        description: "",
        privacyLevel: PrivacyLevel.Private,
        history: -1,
        id: properties.id as number,
      } satisfies DmChannel;
    }
    return {
      dm: false,
      members: sharedModelMembers,
      name: properties.name as string,
      description: properties.description as string,
      privacyLevel: privacyLevelToShared(properties.privacyLevel as number),
      history: -1,
      id: properties.id as number,
    } satisfies GroupChannel;
  }
}
