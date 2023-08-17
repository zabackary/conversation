/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-return-assign */
import Attachment from "../../model/attachment";
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
import NetworkBackend, {
  BackendAttributes,
  ChannelBackend,
  ChannelDetails,
  ChannelJoinInfo,
  DocumentType,
  Subscribable,
} from "./NetworkBackend";

export default class CachedBackend implements NetworkBackend {
  isReady?: Promise<void>;

  connectionState: Subscribable<
    "connecting" | "connected" | "reconnecting" | "error"
  >;

  attributes: Subscribable<BackendAttributes>;

  constructor(private mirroredBackend: NetworkBackend) {
    this.isReady = mirroredBackend.isReady;
    this.connectionState = mirroredBackend.connectionState;
    this.attributes = mirroredBackend.attributes;
  }

  getInvitedChannels(
    offset: number,
    limit: number
  ): Promise<InvitedChannelListing[]> {
    return this.mirroredBackend.getInvitedChannels(offset, limit);
  }

  addMembers(id: number, userIds: UserId[], invitation: string): Promise<void> {
    return this.mirroredBackend.addMembers(id, userIds, invitation);
  }

  removeMembers(
    id: number,
    userIds: UserId[],
    canRejoin?: boolean | undefined
  ): Promise<void> {
    return this.mirroredBackend.removeMembers(id, userIds, canRejoin);
  }

  generateLink(id: number): Promise<string> {
    return this.mirroredBackend.generateLink(id);
  }

  updateChannel(id: number, details: Partial<ChannelDetails>): Promise<void> {
    return this.mirroredBackend.updateChannel(id, details);
  }

  deleteChannel(id: number): Promise<void> {
    return this.mirroredBackend.deleteChannel(id);
  }

  setUserDetails(
    details: Pick<RegisteredUser, "name" | "nickname" | "profilePicture">
  ): Promise<void> {
    return this.mirroredBackend.setUserDetails(details);
  }

  createChannel(
    name: string,
    description: string,
    privacyLevel: PrivacyLevel,
    password?: string | undefined
  ): Promise<Channel> {
    return this.mirroredBackend.createChannel(
      name,
      description,
      privacyLevel,
      password
    );
  }

  authLogIn(username: string, password: string): Promise<void> {
    return this.mirroredBackend.authLogIn(username, password);
  }

  authLogOut(): Promise<void> {
    return this.mirroredBackend.authLogOut();
  }

  authCreateAccount(newUser: NewUserMetadata, password: string): Promise<void> {
    return this.mirroredBackend.authCreateAccount(newUser, password);
  }

  private currentSessionSubscribable:
    | Subscribable<RegisteredUser | null>
    | undefined;

  getCurrentSession(): Subscribable<RegisteredUser | null> {
    return (
      this.currentSessionSubscribable ||
      (this.currentSessionSubscribable =
        this.mirroredBackend.getCurrentSession())
    );
  }

  private userSubscribableMap: Record<string, Subscribable<User | null>> = {};

  getUser(user: UserId): Subscribable<User | null> {
    return (
      this.userSubscribableMap[user] ||
      (this.userSubscribableMap[user] = this.mirroredBackend.getUser(user))
    );
  }

  private attachmentSubscribableMap: Record<
    string,
    Subscribable<Attachment | null>
  > = {};

  getAttachment(attachment: string): Subscribable<Attachment | null> {
    return (
      this.attachmentSubscribableMap[attachment] ||
      (this.attachmentSubscribableMap[attachment] =
        this.mirroredBackend.getAttachment(attachment))
    );
  }

  private statusSubscribableMap: Record<string, Subscribable<boolean | null>> =
    {};

  getUserActivity(user: UserId): Subscribable<boolean | null> {
    return (
      this.statusSubscribableMap[user] ||
      (this.statusSubscribableMap[user] =
        this.mirroredBackend.getUserActivity(user))
    );
  }

  private dmsSubscribable: Subscribable<DmChannel[] | null> | undefined;

  getDMs(): Subscribable<DmChannel[] | null> {
    return (
      this.dmsSubscribable ||
      (this.dmsSubscribable = this.mirroredBackend.getDMs())
    );
  }

  getPublicChannels(
    offset: number,
    limit: number
  ): Promise<PublicChannelListing[]> {
    return this.mirroredBackend.getPublicChannels(offset, limit);
  }

  joinChannel<JoinInfo extends ChannelJoinInfo>(
    info: JoinInfo
  ): Promise<string | null> {
    return this.mirroredBackend.joinChannel(info);
  }

  private channelsSubscribable: Subscribable<Channel[] | null> | undefined;

  getChannels(): Subscribable<Channel[] | null> {
    return (
      this.channelsSubscribable ||
      (this.channelsSubscribable = this.mirroredBackend.getChannels())
    );
  }

  clearCache(): Promise<void> {
    throw new Error("Method not implemented.");
    // TODO: Should this clear the cached backend cache?
  }

  connectChannel(id: number): Promise<ChannelBackend | null> {
    return this.mirroredBackend.connectChannel(id);
  }

  private channelSubscribableMap: Record<string, Subscribable<Channel | null>> =
    {};

  getChannel(id: number): Subscribable<Channel | null> {
    return (
      this.channelSubscribableMap[id] ||
      (this.channelSubscribableMap[id] = this.mirroredBackend.getChannel(id))
    );
  }

  private messageSubscribableMap: Record<number, Subscribable<Message | null>> =
    {};

  getMessage(id: number): Subscribable<Message | null> {
    return (
      this.messageSubscribableMap[id] ||
      (this.messageSubscribableMap[id] = this.mirroredBackend.getMessage(id))
    );
  }

  private searchMap: Record<string, Promise<User[]>> = {};

  searchUsers(query: string): Promise<User[]> {
    return (
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.searchMap[query] ||
      (this.searchMap[query] = this.mirroredBackend.searchUsers(query))
    );
  }

  private openDMMap: Record<string, Promise<number>> = {};

  openDM(user: UserId): Promise<number> {
    return (
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.openDMMap[user] ||
      (this.openDMMap[user] = this.mirroredBackend.openDM(user))
    );
  }

  acceptInvite(id: number): Promise<void> {
    return this.mirroredBackend.acceptInvite(id);
  }

  deleteInvite(id: number): Promise<void> {
    return this.mirroredBackend.deleteInvite(id);
  }

  private documentsMap: Partial<Record<DocumentType, string>> = {};

  async getDocument(documentType: DocumentType): Promise<string> {
    return (
      this.documentsMap[documentType] ??
      (this.documentsMap[documentType] = await this.mirroredBackend.getDocument(
        documentType
      ))
    );
  }
}
