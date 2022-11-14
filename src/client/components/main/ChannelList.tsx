import ChatIcon from "@mui/icons-material/Chat";
import Channel from "../../../data/channel";
import LinkListItem from "./LinkListItem";

interface Props {
  channels?: Channel[] | null;
}

export default function ChannelList(props: Props) {
  const { channels } = props;

  return (
    <>
      {(!channels ? Array<undefined>(3).fill(undefined) : channels).map(
        (channel, index) =>
          channel ? (
            <LinkListItem
              key={channel.id}
              primaryText={channel.name}
              secondaryText={channel.lastMessage?.markdown}
              to={`/channel/${channel.id}`}
              icon={<ChatIcon />}
            />
          ) : (
            // eslint-disable-next-line react/no-array-index-key
            <LinkListItem loading key={index} />
          )
      )}
    </>
  );
}
