import Channel, { PrivacyLevel } from "../../../../model/channel";
import User from "../../../../model/user";
import { SupabaseChannel } from "../cache";
import convertUser from "./convertUser";

export default function convertChannel(dbChannel: SupabaseChannel): Channel {
  const members = dbChannel.users.map(convertUser);
  return dbChannel.is_dm
    ? {
        members: members as [User, User],
        name: "",
        description: "",
        privacyLevel: PrivacyLevel.PRIVATE,
        history: Number.MAX_SAFE_INTEGER,
        id: dbChannel.id,
        lastMessage: undefined,
        dm: true,
      }
    : {
        members,
        name: dbChannel.name ?? "",
        description: dbChannel.description ?? "",
        privacyLevel: dbChannel.privacy_level as PrivacyLevel,
        history: Number.MAX_SAFE_INTEGER,
        id: dbChannel.id,
        lastMessage: undefined,
        dm: false,
        membersCanEdit: dbChannel.members_can_edit,
        passphrase: dbChannel.password ?? undefined,
        owner: dbChannel.owner,
      };
}
