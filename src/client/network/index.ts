import channel, { PublicChannelListing } from "../../data/channel";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
} from "./network_definitions";

export default class GASBackend implements NetworkBackend {
  connectChannel(id: number): Promise<ChannelBackend> {
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
