import { Avatar, AvatarProps } from "@mui/material";

interface UserLike {
  profilePicture?: string;
  name: string;
  nickname?: string;
}

export interface ProfilePictureProps extends AvatarProps {
  user: UserLike;
}

/**
 * Render an MUI <Avatar> component using a user-like object, first trying to
 * render the profile picture URL then falling back to the first letter of their
 * nickname (if it exists) or name.
 * @param props The props of the component.
 */
export default function ProfilePicture({
  user,
  ...avatarProps
}: ProfilePictureProps) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Avatar src={user.profilePicture} alt={user.name} {...avatarProps}>
      {(user.nickname ?? user.name)[0]}
    </Avatar>
  );
}
