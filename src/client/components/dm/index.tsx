import { Avatar, List, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import { DmChannel } from "../../../data/channel";
import User, { UserStatus } from "../../../data/user";
import { ConversationAppBar } from "../DrawerLayout";
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
        <List>
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
                        <Avatar alt={person?.name} />
                      </ContrastBadge>
                    }
                    key={channel.id}
                  />
                );
              })
            : null}
        </List>
      </Stack>
      <Outlet />
    </>
  );
}
