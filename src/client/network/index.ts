import channel, { PublicChannelListing } from "../../data/channel";
import NetworkManager, {
  ChannelJoinInfo,
  ChannelManager,
} from "./network_definitions";

export default class GASNetworkManager implements NetworkManager {
  connectChannel(id: number): Promise<ChannelManager> {
    throw new Error("Method not implemented.");
  }
  getPublicChannels(): Promise<PublicChannelListing[]> {
    throw new Error("Method not implemented.");
  }
  joinChannel<JoinInfo extends ChannelJoinInfo>(
    info: JoinInfo
  ): Promise<string | null> {
    throw new Error("Method not implemented.");
  }
  getChannels(): Promise<channel[]> {
    throw new Error("Method not implemented.");
  }
  clearCache(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
