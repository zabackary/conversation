import Channel, {
  DmChannel,
  InvitedChannelListing,
  PrivacyLevel,
  PublicChannelListing,
} from "../../model/channel";
import Message from "../../model/message";
import User, {
  NewUserMetadata,
  RegisteredUser,
  UserId,
} from "../../model/user";
import type _QueuedBackend from "./QueuedBackend";
import Subscribable from "./Subscribable";

// Re-export `Subscribable` for compat reasons
export { Subscribable };

/**
 * @deprecated prefer {@link LOGGED_OUT}
 */
export class LoggedOutException extends Error {
  name = "LoggedOutException";
}

export const LOGGED_OUT = Symbol("logged out");

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

export default interface NetworkBackend {
  /**
   * A promise resolving when the backend is finished initializing. If not,
   * requests to the backend should be queued, for example, using
   * {@link _QueuedBackend `QueuedBackend`}
   */
  isReady?: Promise<void>;

  /**
   * A subscribable echoing the current state of the connection.
   */
  connectionState: Subscribable<
    "connecting" | "connected" | "reconnecting" | "error"
  >;

  /**
   * Gets the current user session. Replaces `getUser(undefined)`.
   */
  getCurrentSession(): Subscribable<RegisteredUser | null>;

  /**
   * Gets the logged in user or get by ID.
   *
   * @returns A subscribable echoing `User`, `null` on loading, or errors on
   * logged out.
   */
  getUser(id: UserId): Subscribable<User | null>;

  /**
   * Gets the status of a user.
   *
   * @param {string} user The user to fetch for.
   *
   * @returns A boolean indicating whether the user is active or `null` if the
   * user doesn't exist.
   */
  getUserActivity(user: UserId): Subscribable<boolean | null>;

  /**
   * Returns the DMs a user currently has open. These are `DmChannel`s.
   *
   * @throws {LoggedOutException} if the user is logged out
   * @returns A subscribable echoing `DmChannel`s.
   */
  getDMs(): Subscribable<DmChannel[] | null>;

  /**
   * Gets all channels with privacy "public" that can be joined without invite.
   *
   * @returns A promise resolving with a list of public `Channel`s that are
   * not currently joined by the user.
   */
  getPublicChannels(
    offset: number,
    limit: number
  ): Promise<PublicChannelListing[]>;

  /**
   * Gets all channels with privacy "private" that the user is invited to.
   *
   * @returns A promise resolving with a list of private `Channel`s that
   * can be joined and are not currently joined by the user.
   */
  getInvitedChannels(
    offset: number,
    limit: number
  ): Promise<InvitedChannelListing[]>;

  /**
   * Searches users matching the given search term by email, name, etc.
   */
  searchUsers(query: string): Promise<User[]>;

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
   * Adds the user as a member of the channel, after having an invite.
   *
   * @param id The ID of the channel the invite is corallated to.
   */
  acceptInvite(id: number): Promise<void>;

  /**
   * Deletes an invite.
   *
   * @param id The ID of the channel of the invite to be deleted.
   */
  deleteInvite(id: number): Promise<void>;

  /**
   * Create a channel and join it.
   *
   * @param name The name of the new channel
   * @param description The description
   * @param privacyLevel The privacy level
   * @param password The password, if `privacyLevel` is {@link PrivacyLevel.Unlisted `Unlisted`}
   * @returns A promise resolving with the new channel or rejecting if something
   * went wrong.
   */
  createChannel(
    name: string,
    description: string,
    privacyLevel: PrivacyLevel,
    password?: string
  ): Promise<Channel>;

  /**
   * Gets the channels the user is in.
   *
   * @throws {LoggedOutException}
   * @returns A subscribable with a list of `Channel`s.
   */
  getChannels(): Subscribable<Channel[] | null>;

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

  /**
   * Updates a channel with the given `ChannelDetails`. Throw if user has bad
   * permissions.
   */
  updateChannel(id: number, details: Partial<ChannelDetails>): Promise<void>;

  /**
   * Deletes a channel if the user is the owner. All related messages are
   * *forever lost*.
   */
  deleteChannel(id: UserId): Promise<void>;

  /**
   * Adds a member to a channel.
   */
  addMembers(id: number, userIds: UserId[], invitation: string): Promise<void>;

  /**
   * Removes a member from the channel, if `membersCanEdit` or the user is the
   * owner.
   *
   * @argument id The ID of the user to remove.
   * @argument canRejoin Whether the user can still rejoin the channel. Only
   * owners can use this flag. If `false`, basically banning.
   */
  removeMembers(
    id: number,
    userIds: UserId[],
    canRejoin?: boolean
  ): Promise<void>;

  /**
   * Get a message's info.
   * @param id The ID of the message to get
   */
  getMessage(id: number): Subscribable<Message | null>;

  /**
   * Generates and returns a link that users can use to join the given channel.
   *
   * @argument maxUsers Optional; the maximum amount of users that can use this
   * link. If unset and channel is unlisted, backends SHOULD encode the passcode
   * to join the channel.
   */
  generateLink(id: number): Promise<string>;

  /**
   * Logs the user in given credentials.
   *
   * @returns A promise resolving if the login is successful, and rejecting on
   * bad email/password.
   */
  authLogIn(email: string, password: string): Promise<void>;

  /**
   * Logs the current session out.
   *
   * @returns A promise resolving when the user is logged out.
   */
  authLogOut(): Promise<void>;

  /**
   * Creates a new account. Validation should be done beforehand on the client
   * as no error reason is returned.
   *
   * @returns A promise resolving if the creation is successful, and rejecting
   * is something went wrong.
   */
  authCreateAccount(newUser: NewUserMetadata, password: string): Promise<void>;
}

export interface ChannelBackend {
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

  /**
   * Sends a message
   *
   * @returns a promise that resolves when the message is sent.
   */
  send(message: SentMessageEvent): Promise<void>;
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

export interface SentMessage {
  markdown: string;
  images?: Blob[];
  attachments?: Blob[];
  replied?: number;
}

export type ActionPayload =
  | number
  | string
  | boolean
  | Date
  | Blob
  | ActionPayloadObject
  | Array<ActionPayload>;

interface ActionPayloadObject {
  [key: string]: ActionPayload;
}

export interface Action {
  /**
   * Service the action is dispatching to.
   */
  serviceId: number;

  /**
   * The data associated with the action
   */
  data: ActionPayload;
}

export type SentMessageEvent = SentMessage | { action: Action };

export interface ChannelDetails {
  name: string;
  description: string;
  privacyLevel: PrivacyLevel;
  membersCanEdit: boolean;
}
