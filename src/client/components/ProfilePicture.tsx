import { Avatar, AvatarProps } from "@mui/material";
import { forwardRef } from "react";

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
const ProfilePicture = forwardRef<HTMLDivElement, ProfilePictureProps>(
  ({ user, ...avatarProps }, ref) => {
    return (
      <Avatar
        src={user.profilePicture}
        alt={user.name}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...avatarProps}
        ref={ref}
      >
        {(user.nickname ?? user.name)[0]}
      </Avatar>
    );
  }
);

export default ProfilePicture;
