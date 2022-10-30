import Channel, {
  PrivacyLevel,
  PublicChannelListing,
} from "../../data/channel";

export interface ChannelJoinInfo {
  type: PrivacyLevel;
}

export interface PublicChannelJoinInfo extends ChannelJoinInfo {
  type: PrivacyLevel.Public;
}

export interface UnlistedChannelJoinInfo extends ChannelJoinInfo {
  type: PrivacyLevel.Unlisted;
  id: number;
  key: string;
}

export interface PrivateChannelJoinInfo extends ChannelJoinInfo {
  type: PrivacyLevel.Private;
  id: number;
}

export default interface NetworkManager {
  /**
   * Gets all channels with privacy "public" that can be joined without invite.
   */
  getPublicChannels(): Promise<PublicChannelListing[]>;

  /**
   * Joins a channel, given a `ChannelJoinInfo`. Returns the name of the
   * channel or `null` on error.
   */
  joinChannel<JoinInfo extends ChannelJoinInfo>(
    info: JoinInfo
  ): Promise<string | null>;

  /**
   * Gets the channels the user is in.
   */
  getChannels(): Promise<Channel[]>;

  /**
   * Clears the cache. The cache only persists on one session locally, so this
   * is a bit pointless as you can just reload.
   */
  clearCache(): Promise<void>;
}
