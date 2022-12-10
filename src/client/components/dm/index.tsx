import { Avatar, List, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import { DmChannel } from "../../../model/channel";
import User, { UserStatus } from "../../../model/user";
import { ConversationAppBar } from "../Layout";
import { ContrastBadge } from "../main/DrawerHeader";
import LinkListItem from "../main/LinkListItem";

export interface DmProps {
  channels?: DmChannel[];
  user?: User;
}

export default function Dm({ channels, user }: DmProps) {
  return (
    <>
      <ConversationAppBar title="Conversations" />
      <Stack direction="row">
        <List sx={{ width: "240px", flexShrink: 0 }}>
          {channels
            ? channels.map((channel) => {
                const person = channel.members.find(
                  (member) => member.id !== user?.id
                );
                return (
                  <LinkListItem
                    primaryText={person?.name}
                    secondaryText={person?.email}
                    to={`/dm/${channel.id}`}
                    avatar={
                      <ContrastBadge
                        color="success"
                        variant="dot"
                        overlap="circular"
                        invisible={person?.status === UserStatus.Inactive}
                      >
                        <Avatar
                          src={person?.profilePicture ?? undefined}
                          alt={person?.name}
                        >
                          {person?.nickname[0]}
                        </Avatar>
                      </ContrastBadge>
                    }
                    key={channel.id}
                  />
                );
              })
            : null}
        </List>
        <Outlet />
      </Stack>
    </>
  );
}
