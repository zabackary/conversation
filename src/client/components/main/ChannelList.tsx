import ChatIcon from "@mui/icons-material/Chat";
import { Collapse } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import Channel from "../../../data/channel";
import LinkListItem from "./LinkListItem";

interface Props {
  channels?: Channel[] | null;
}

export default function ChannelList(props: Props) {
  const { channels } = props;

  return (
    <TransitionGroup>
      {(!channels ? Array<undefined>(3).fill(undefined) : channels).map(
        (channel, index) => (
          <Collapse key={channel ? channel.id : index}>
            {channel ? (
              <LinkListItem
                primaryText={channel.name}
                secondaryText={channel.lastMessage?.markdown}
                to={`/channel/${channel.id}`}
                icon={<ChatIcon />}
                badge={500}
              />
            ) : (
              <LinkListItem loading />
            )}
          </Collapse>
        )
      )}
    </TransitionGroup>
  );
}
