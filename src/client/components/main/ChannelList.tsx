import ChatIcon from "@mui/icons-material/Chat";
import { Avatar, Collapse } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import Channel from "../../../model/channel";
import useUser from "../../hooks/useUser";
import useUserActivity from "../../hooks/useUserActivity";
import { ContrastBadge } from "./DrawerHeader";
import LinkListItem from "./LinkListItem";

export interface DmChannelListItemProps {
  channel: Channel;
}

export function DmChannelListItem({ channel }: ChannelListItemProps) {
  const user = useUser();
  const person = channel.members.find((member) => member.id !== user?.id);
  if (!person) throw new Error("Couldn't find the other person in this DM.");
  const active = useUserActivity(person.id);
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
          invisible={!active}
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

export interface ChannelListItemProps {
  channel: Channel;
}
export function ChannelListItem({ channel }: ChannelListItemProps) {
  if (channel.dm) {
    return <DmChannelListItem channel={channel} />;
  }
  const { lastMessage } = channel;
  return (
    <LinkListItem
      primaryText={channel.name}
      secondaryText={lastMessage?.isService ? undefined : lastMessage?.markdown}
      to={`/app/channels/${channel.id}`}
      icon={<ChatIcon />}
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
