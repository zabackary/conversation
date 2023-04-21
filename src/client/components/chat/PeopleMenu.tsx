import CheckIcon from "@mui/icons-material/Check";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Autocomplete,
  Avatar,
  AvatarGroup,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  SxProps,
  TextField,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import Channel from "../../../model/channel";
import User from "../../../model/user";

export interface PeopleMenuListItemProps {
  user: User;
}

export function PeopleMenuListItem({ user }: PeopleMenuListItemProps) {
  return (
    <ListItem
      disablePadding
      sx={{
        "&:not(:hover, :focus-within) .MuiListItemSecondaryAction-root": {
          display: "none",
        },
      }}
      secondaryAction={
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      }
    >
      <ListItemButton>
        <ListItemAvatar>
          <Avatar src={user.profilePicture} alt={user.name}>
            {(user.nickname ?? user.name)[0]}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={user.name} secondary={user.nickname} />
      </ListItemButton>
    </ListItem>
  );
}

export interface PeopleMenuProps {
  channel: Channel;
  sx?: SxProps;
}

export default function PeopleMenu({ channel, sx }: PeopleMenuProps) {
  const options: User[] = [];
  const [inviteValue, setInviteValue] = useState<User[]>([]);
  const handleInviteChange = (_event: SyntheticEvent, newValue: User[]) => {
    setInviteValue(newValue);
  };
  return (
    <Stack sx={sx} spacing={2}>
      <Stack spacing={2} direction="row">
        <AvatarGroup max={4}>
          {channel.members.map((member) => (
            <Avatar
              src={member.profilePicture}
              alt={member.name}
              key={member.id}
            />
          ))}
        </AvatarGroup>
        <Button variant="tonal">Leave channel</Button>
      </Stack>
      <Autocomplete
        multiple
        options={options}
        value={inviteValue}
        onChange={handleInviteChange}
        renderInput={(props) => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            variant="filled"
            label="Add members"
            placeholder="Search users..."
          />
        )}
        renderOption={(props, user, state) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <ListItem disablePadding {...props}>
            <ListItemAvatar>
              {state.selected ? (
                <Avatar>
                  <CheckIcon />
                </Avatar>
              ) : (
                <Avatar src={user.profilePicture} alt={user.name} />
              )}
            </ListItemAvatar>
            <ListItemText primary={user.name} secondary={user.nickname} />
          </ListItem>
        )}
        disableCloseOnSelect
        getOptionLabel={(option) => option.nickname ?? option.name}
        ChipProps={{
          variant: "outlined",
          sx: { my: "6px !important" },
        }}
        fullWidth
      />
      <List>
        {channel.members.map((member) => (
          <PeopleMenuListItem user={member} key={member.id} />
        ))}
      </List>
    </Stack>
  );
}
