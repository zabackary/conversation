import { List, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import { DmChannel } from "../../../model/channel";
import { ConversationAppBar } from "../layout";
import { ChannelListItem } from "../main/ChannelList";

export interface DmProps {
  channels?: DmChannel[];
}

export default function Dm({ channels }: DmProps) {
  return (
    <>
      <ConversationAppBar title="Conversations" />
      <Stack direction="row">
        <List sx={{ width: "240px", flexShrink: 0 }}>
          {channels
            ? channels.map((channel) => <ChannelListItem channel={channel} />)
            : null}
        </List>
        <Outlet />
      </Stack>
    </>
  );
}
