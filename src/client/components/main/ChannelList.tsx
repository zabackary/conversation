import ChatIcon from "@mui/icons-material/Chat";
import { Avatar, Collapse } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import Channel from "../../../model/channel";
import useUser from "../../hooks/useUser";
import { ContrastBadge } from "./DrawerHeader";
import LinkListItem from "./LinkListItem";

interface ChannelListItemProps {
  channel: Channel;
}
function ChannelListItem({ channel }: ChannelListItemProps) {
  const user = useUser();
  if (channel.dm) {
    const person = channel.members.find((member) => member.id !== user?.id);
    if (!person) throw new Error("Couldn't find the other person in this DM.");
    return (
      <LinkListItem
        primaryText={person.name}
        secondaryText={person.email}
        to={`/app/dms/${channel.id}`}
        avatar={
          <ContrastBadge
            color="success"
            variant="dot"
            overlap="circular"
            invisible={!person.active}
          >
            <Avatar src={person.profilePicture ?? undefined} alt={person.name}>
              {(person.nickname ?? person.name)[0]}
            </Avatar>
          </ContrastBadge>
        }
        badge={500}
      />
    );
  }
  const { lastMessage } = channel;
  return (
    <LinkListItem
      primaryText={channel.name}
      secondaryText={lastMessage?.isService ? undefined : lastMessage?.markdown}
      to={`/app/channels/${channel.id}`}
      icon={<ChatIcon />}
      badge={500}
    />
  );
}

interface Props {
  channels?: Channel[] | null;
}

export default function ChannelList(props: Props) {
  const { channels } = props;

  if (channels) {
    return (
      <TransitionGroup>
        {channels.map((channel) => (
          <Collapse key={channel.id}>
            <ChannelListItem channel={channel} />
          </Collapse>
        ))}
      </TransitionGroup>
    );
  }
  return (
    <>
      {Array<undefined>(3)
        .fill(undefined)
        .map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <LinkListItem loading key={index} />
        ))}
    </>
  );
}
