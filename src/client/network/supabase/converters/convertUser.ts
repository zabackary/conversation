import User, { PrivilegeLevel } from "../../../../model/user";
import { SupabaseUser } from "../cache";

export default function convertUser(dbUser: SupabaseUser): User {
  // TODO: Add status, banner, etc. to Supabase
  if (dbUser.is_bot) {
    return {
      id: dbUser.id,
      isBot: true,
      name: dbUser.name,
      privilegeLevel: dbUser.trusted
        ? PrivilegeLevel.Normal
        : PrivilegeLevel.Unverified,
      active: false,
      author: undefined,
      banner: undefined,
      email: undefined,
      profilePicture: dbUser.profile_picture_url ?? undefined,
    };
  }
  return {
    id: dbUser.id,
    isBot: false,
    name: dbUser.name,
    nickname: dbUser.nickname,
    privilegeLevel: dbUser.trusted
      ? PrivilegeLevel.Normal
      : PrivilegeLevel.Unverified,
    active: false,
    banner: undefined,
    email: undefined,
    profilePicture: dbUser.profile_picture_url ?? undefined,
    status: undefined,
    tag: undefined,
  };
}
