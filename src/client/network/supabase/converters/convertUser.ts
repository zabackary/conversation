import User, { PrivilegeLevel } from "../../../../model/user";
import { SupabaseUser } from "../cache";

export default function convertUser(dbUser: SupabaseUser): User {
  const base = {
    id: dbUser.id,
    name: dbUser.name,
    // eslint-disable-next-line no-nested-ternary
    privilegeLevel: dbUser.admin
      ? PrivilegeLevel.Admin
      : dbUser.verified
      ? PrivilegeLevel.Normal
      : PrivilegeLevel.Unverified,
    banner: dbUser.banner_url ?? undefined,
    email: dbUser.email ?? undefined,
    profilePicture: dbUser.profile_picture_url ?? undefined,
    disabled: dbUser.disabled,
  };
  // TODO: Add status, email to Supabase
  if (dbUser.is_bot) {
    return {
      isBot: true,
      ...base,
    };
  }
  return {
    isBot: false,
    nickname: dbUser.nickname,
    tag: undefined,
    ...base,
  };
}
