/* eslint-disable max-classes-per-file */
import Entity from "../libDatabase/Entity";
import DateTimeValidator from "../libDatabase/validators/DateTimeValidator";
import EmailValidator from "../libDatabase/validators/EmailValidator";
import JsonValidator from "../libDatabase/validators/JsonValidator";
import RangeValidator from "../libDatabase/validators/RangeValidator";
import Unique from "../libDatabase/validators/Unique";
import UrlValidator from "../libDatabase/validators/UrlValidator";

export class User extends Entity {
  tableName = "user";

  schema = {
    id: {
      type: "number" as const,
      autoAssign: true,
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
      nullable: true,
      validators: [new UrlValidator()],
    },
    banner: {
      type: "string" as const,
      nullable: true,
      validators: [new UrlValidator()],
    },
    isService: {
      type: "boolean" as const,
    },
    serviceOwner: {
      nullable: true,
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
}

export class Channel extends Entity {
  tableName = "channel";

  schema = {
    id: {
      type: "number" as const,
      autoAssign: true,
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
      nullable: true,
    },
  };
}

export class UserChannelMap extends Entity {
  tableName = "userChannelMap";

  schema = {
    id: {
      type: "number" as const,
      autoAssign: true,
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
      validators: [new DateTimeValidator()],
    },
  };
}

export class Message extends Entity {
  tableName = "message";

  schema = {
    id: {
      type: "number" as const,
      autoAssign: true,
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
      nullable: true,
    },
    attachments: {
      type: "string" as const,
      validators: [new JsonValidator()],
    },
    richParts: {
      type: "string" as const,
      nullable: true,
      validators: [new JsonValidator()],
    },
  };
}

export class Session extends Entity {
  tableName = "session";

  schema = {
    id: {
      type: "number" as const,
      autoAssign: true,
      primaryKey: true,
      validators: [new Unique()],
    },
    userId: {
      type: "number" as const,
      nullable: true,
      foreignKey: "user.id",
    },
    createdTime: {
      type: "string" as const,
      validators: [new DateTimeValidator()],
    },
    userAgent: {
      type: "string" as const,
      nullable: true,
    },
    token: {
      type: "string" as const,
      nullable: true,
    },
  };
}

export class Invite extends Entity {
  tableName = "invite";

  schema = {
    id: {
      type: "number" as const,
      autoAssign: true,
      primaryKey: true,
      validators: [new Unique()],
    },
    userId: {
      type: "number" as const,
      foreignKey: "user.id",
    },
    inviteeId: {
      type: "number" as const,
      foreignKey: "user.id",
    },
    channelId: {
      type: "number" as const,
      foreignKey: "channel.id",
    },
    message: {
      type: "string" as const,
    },
  };
}
