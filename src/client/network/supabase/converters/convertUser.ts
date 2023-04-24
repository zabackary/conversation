import User, { PrivilegeLevel } from "../../../../model/user";
import { SupabaseUser } from "../cache";

export default function convertUser(dbUser: SupabaseUser): User {
  // TODO: Add status, email to Supabase
  if (dbUser.is_bot) {
    return {
      id: dbUser.id,
      isBot: true,
      name: dbUser.name,
      // eslint-disable-next-line no-nested-ternary
      privilegeLevel: dbUser.admin
        ? PrivilegeLevel.Admin
        : dbUser.verified
        ? PrivilegeLevel.Normal
        : PrivilegeLevel.Unverified,
      active: false,
      author: undefined,
      banner: dbUser.banner_url ?? undefined,
      email: undefined, // TODO: Add user to userMetadata DB model
      profilePicture: dbUser.profile_picture_url ?? undefined,
    };
  }
  return {
    id: dbUser.id,
    isBot: false,
    name: dbUser.name,
    nickname: dbUser.nickname,
    // eslint-disable-next-line no-nested-ternary
    privilegeLevel: dbUser.admin
      ? PrivilegeLevel.Admin
      : dbUser.verified
      ? PrivilegeLevel.Normal
      : PrivilegeLevel.Unverified,
    active: false,
    banner: dbUser.banner_url ?? undefined,
    email: undefined,
    profilePicture: dbUser.profile_picture_url ?? undefined,
    status: undefined,
    tag: undefined,
  };
}
