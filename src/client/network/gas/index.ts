import Channel, {
  DmChannel,
  PublicChannelListing,
} from "../../../model/channel";
import User, { NewUser, UserStatus } from "../../../model/user";
import { ApiActionType } from "../../../shared/apiActions";
import { ApiSubscriptionType } from "../../../shared/apiSubscriptions";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
  Subscribable,
} from "../network_definitions";
import { createSubscribable } from "../utils";
import ApiManager from "./api";

export default class GASBackend implements NetworkBackend {
  apiManager: ApiManager;

  currentUser: Subscribable<User>;

  constructor() {
    this.apiManager = ApiManager.getInstance();
    this.apiManager.beginPooling();
    this.currentUser = createSubscribable<User>((next) => {
      this.apiManager.addSubscription(
        ApiSubscriptionType.User,
        null,
        (response) => {
          console.log(response);
          next(response);
        }
      );
    }, null);
  }

  async authLogIn(email: string, password: string): Promise<void> {
    const token = await this.apiManager.runAction(ApiActionType.LogIn, {
      email,
      password,
    });
    if (!token) throw new Error("login failure");
    this.apiManager.setToken(token);
  }

  async authLogOut(): Promise<void> {
    const success = await this.apiManager.runAction(ApiActionType.LogOut, null);
    if (!success) throw new Error("logout failure");
  }

  async authCreateAccount(newUser: NewUser, password: string): Promise<void> {
    const success = await this.apiManager.runAction(
      ApiActionType.CreateAccount,
      { ...newUser, password }
    );
    if (!success) throw new Error("create account failure");
  }

  getUser(id?: number): Subscribable<User | null> {
    if (!id) return this.currentUser;
    return createSubscribable<User>((next) => {
      this.apiManager.addSubscription(
        ApiSubscriptionType.User,
        id,
        (response) => {
          console.log(response);
          next(response);
        }
      );
    }, null);
  }

  getStatus(_username: string): Subscribable<UserStatus | null> {
    throw new Error("Method not implemented.");
  }

  getDMs(): Subscribable<DmChannel[]> {
    throw new Error("Method not implemented.");
  }

  getPublicChannels(): Subscribable<PublicChannelListing[]> {
    throw new Error("Method not implemented.");
  }

  joinChannel<JoinInfo extends ChannelJoinInfo>(
    _info: JoinInfo
  ): Promise<string | null> {
    throw new Error("Method not implemented.");
  }

  getChannels(): Subscribable<Channel[]> {
    throw new Error("Method not implemented.");
  }

  clearCache(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  connectChannel(_id: number): Promise<ChannelBackend> {
    throw new Error("Method not implemented.");
  }

  getChannel(_id: number): Subscribable<Channel | null> {
    throw new Error("Method not implemented.");
  }
}
