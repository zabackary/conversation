import Channel, {
  DmChannel,
  PrivacyLevel,
  PublicChannelListing,
} from "../../data/channel";
import Message from "../../data/message";
import User, { UserStatus } from "../../data/user";

export class LoggedOutException extends Error {}

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

export interface Subscribable<T> {
  /**
   * Subscribe to any changes in the data source using the callback.
   *
   * @param {call} callback The function to call upon an event.
   *
   * @returns A function you can use to cancel the subscription.
   */
  subscribe(callback: (value: T) => void): () => void;

  /**
   * Gets the current state of the subscribable.
   */
  getSnapshot(): T | null;
}

export default interface NetworkBackend {
  /**
   * Gets the logged in user.
   *
   * @throws {LoggedOutException} If the user is logged out.
   * @returns A subscribable echoing `User`s.
   */
  getUser(): Subscribable<User>;

  /**
   * Gets the status of a user.
   *
   * @param {string} user The user to fetch for.
   *
   * @returns A `UserStatus` or null if the user doesn't exist.
   */
  getStatus(user: string): Subscribable<UserStatus | null>;

  /**
   * Returns the DMs a user currently has open. These are `DmChannel`s.
   *
   * @throws {LoggedOutException} if the user is logged out
   * @returns A subscribable echoing `DmChannel`s.
   */
  getDMs(): Subscribable<DmChannel[]>;

  /**
   * Gets all channels with privacy "public" that can be joined without invite.
   *
   * @returns A subscribable representing a list of public `Channel`s that are
   * not currently joined by the user.
   */
  getPublicChannels(): Subscribable<PublicChannelListing[]>;

  /**
   * Joins a channel, given a `ChannelJoinInfo`. Returns the name of the
   * channel or `null` on error.
   *
   * @returns A promise resolving with the name of the channel as a `string` or
   * `null` if the `JoinInfo` isn't valid.
   */
  joinChannel<JoinInfo extends ChannelJoinInfo>(
    info: JoinInfo
  ): Promise<string | null>;

  /**
   * Gets the channels the user is in.
   *
   * @throws {LoggedOutException}
   * @returns A subscribable with a list of `Channel`s.
   */
  getChannels(): Subscribable<Channel[]>;

  /**
   * Clears the cache. The cache only persists on one session locally, so this
   * is a bit pointless as you can just reload, unless this ends up having a
   * better server-side implementation.
   *
   * @returns A promise that resolves when the cache is cleared.
   */
  clearCache(): Promise<void>;

  /**
   * Connects to a given channel and returns a `ChannelBackend` associated with
   * it. Channel id must be in `getChannels()`.
   *
   * @throws {LoggedOutException} if the user isn't logged in
   * @returns A promise that resolves to the `ChannelBackend` with the id given
   * or `null` if permissions don't allow it.
   */
  connectChannel(id: number): Promise<ChannelBackend | null>;

  /**
   * Returns the channel corresponding to the `id`.
   *
   * @returns A subscribable returning a `Channel` or `null` if access is not
   * sufficient or the channel doesn't exist.
   */
  getChannel(id: number): Subscribable<Channel | null>;
}

export interface ChannelBackend
  extends Pick<Subscribable<ChannelBackendEvent>, "subscribe"> {
  /**
   * Whether the backend is hooked up. If `false`, `connect()` can be called to
   * connect.
   */
  connected: boolean;

  /**
   * Opens a connection to the channel backend. This doesn't do anything with
   * the `GASBackend` but will be useful if a `WebSocket` backend is
   * implemented later.
   *
   * @returns A promise that resolves when a successful connection is
   * established. It will reject if an error occurs.
   */
  connect(): Promise<void>;

  /**
   * Closes the connection to the server. Note that `connected` will be `false`
   * and the listeners attached will be disposed of.
   *
   * @returns A promise that resolves once the connection is closed. This
   * promise should not reject.
   */
  disconnect(): Promise<void>;

  /**
   * Gets the existing messages at the time of channel open. This method is
   * *not* intended to be called more than once and is permitted to have
   * suboptimal performance on the server-side implmentation.
   *
   * @returns A promise that resolves with a list of `Message`s.
   */
  listMessages(): Promise<Message[]>;

  /**
   * Subscribes to new messages sent to the channel. The messages should be
   * forwarded to the client as soon as possible (e.g., don't get messages from
   * the database but instead so caching or Redis or something server-side.)
   *
   * @returns A function that can be used to cancel the subscription.
   */
  subscribe(callback: (event: ChannelBackendEvent) => void): () => void;
}

export type ChannelBackendEvent =
  | ChannelBackendConnectionEvent
  | ChannelBackendMessageEvent;

export interface ChannelBackendConnectionEvent {
  type: "connection";
  status: boolean;
  message?: string;
}

export interface ChannelBackendMessageEvent {
  type: "message";
  newMessage: Message;
}
