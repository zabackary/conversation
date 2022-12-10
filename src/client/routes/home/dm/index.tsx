import { useParams } from "react-router-dom";
import StatelessDmChannel from "../../../components/dm/DmChannel";

export default function DmRoute() {
  const { channelId: channelIdString } = useParams();
  const channelId = parseInt(channelIdString || "", 10);
  if (Number.isNaN(channelId)) throw new Error("Invalid channel id.");
  return <StatelessDmChannel channelId={channelId} />;
}
