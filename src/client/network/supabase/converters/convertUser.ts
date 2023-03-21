import User, { UserState, UserStatus } from "../../../../model/user";
import { SupabaseUser } from "../cache";

export default function convertUser(dbUser: SupabaseUser): User {
  return {
    name: dbUser.name,
    nickname: dbUser.nickname,
    email: "unknown", // TODO: Add email to Supabase
    profilePicture: dbUser.profile_picture_url,
    id: dbUser.id,
    status: UserStatus.Inactive,
    state: dbUser.trusted ? UserState.Normal : UserState.Unverified,
    banner: null,
  };
}
