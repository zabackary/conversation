import ChatIcon from "@mui/icons-material/Chat";
import { Collapse } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import Channel from "../../../model/channel";
import LinkListItem from "./LinkListItem";

interface Props {
  channels?: Channel[] | null;
}

export default function ChannelList(props: Props) {
  const { channels } = props;

  return (
    <TransitionGroup>
      {(!channels ? Array<undefined>(3).fill(undefined) : channels).map(
        (channel, index) => {
          const lastMessage = channel?.lastMessage;
          return (
            <Collapse key={channel ? channel.id : index}>
              {channel ? (
                <LinkListItem
                  primaryText={channel.name}
                  secondaryText={
                    lastMessage?.isService ? undefined : lastMessage?.markdown
                  }
                  to={`/channel/${channel.id}`}
                  icon={<ChatIcon />}
                  badge={500}
                />
              ) : (
                <LinkListItem loading />
              )}
            </Collapse>
          );
        }
      )}
    </TransitionGroup>
  );
}
