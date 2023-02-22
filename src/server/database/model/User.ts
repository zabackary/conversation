import SharedModelService from "../../../model/service";
import SharedModelUser, { UserStatus } from "../../../model/user";
import Entity from "../../libDatabase/Entity";
import EmailValidator from "../../libDatabase/validators/EmailValidator";
import RangeValidator from "../../libDatabase/validators/RangeValidator";
import Unique from "../../libDatabase/validators/Unique";
import UrlValidator from "../../libDatabase/validators/UrlValidator";

export default class User extends Entity {
  tableName = "user";

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
    email: {
      type: "string" as const,
      validators: [new EmailValidator()],
    },
    status: {
      type: "boolean" as const,
    },
    nickname: {
      type: "string" as const,
    },
    profilePicture: {
      type: "string" as const,
      nullable: true as const,
      validators: [new UrlValidator()],
    },
    banner: {
      type: "string" as const,
      nullable: true as const,
      validators: [new UrlValidator()],
    },
    isService: {
      type: "boolean" as const,
    },
    serviceOwner: {
      nullable: true as const,
      type: "number" as const,
      foreignKey: "user.id",
    },
    state: {
      type: "number" as const,
      validators: [new RangeValidator(0, 2)],
    },
    passwordHash: {
      type: "string" as const,
    },
  };

  toSharedModel(
    userFromId: (id: number) => User
  ): SharedModelUser | SharedModelService {
    if (this.rowNumber === null)
      throw new Error("Cannot serilize when rowNumber is unset");
    const { properties } = this;
    if (properties.isService) {
      return {
        name: properties.name as string,
        icon: properties.profilePicture as string | null,
        banner: properties.banner as string | null,
        author: userFromId(properties.serviceOwner as number).toSharedModel(
          userFromId
        ) as SharedModelUser,
        id: properties.id as number,
      } satisfies SharedModelService;
    }
    return {
      name: properties.name as string,
      nickname: properties.nickname as string,
      email: properties.email as string,
      profilePicture: properties.profilePicture as string | null,
      id: properties.id as number,
      status: properties.status ? UserStatus.Active : UserStatus.Inactive,
      state: properties.state as number,
    } satisfies SharedModelUser;
  }
}
