import { useParams } from "react-router-dom";
import Chat from "../../../../components/chat/Chat";
import JoinScreen from "./join";

export default function ChannelRoute() {
  const { channelId: channelIdString } = useParams();
  if (channelIdString === "join") {
    return <JoinScreen />;
  }
  const channelId = parseInt(channelIdString || "", 10);
  if (Number.isNaN(channelId)) throw new Error("Invalid channel id.");
  return <Chat channelId={channelId} />;
}
