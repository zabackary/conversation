/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-return-assign */
import Channel, { DmChannel, PublicChannelListing } from "../../model/channel";
import User, { NewUserMetadata, UserId } from "../../model/user";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
  Subscribable,
} from "./network_definitions";
import { createSubscribable } from "./utils";

export default class QueuedBackend implements NetworkBackend {
  currentRoute: NetworkBackend | undefined;

  routeFound: Promise<NetworkBackend>;

  routeTo: (route: NetworkBackend) => void;

  constructor() {
    let resolveRouteFound: undefined | ((route: NetworkBackend) => void);
    this.routeFound = new Promise((resolve) => {
      resolveRouteFound = resolve;
    });
    this.routeTo = (route) => {
      this.currentRoute = route;
      if (resolveRouteFound) resolveRouteFound(route);
    };
  }

  async authLogIn(username: string, password: string): Promise<void> {
    const backend = await this.routeFound;
    return backend.authLogIn(username, password);
  }

  async authLogOut(): Promise<void> {
    const backend = await this.routeFound;
    return backend.authLogOut();
  }

  async authCreateAccount(
    newUser: NewUserMetadata,
    password: string
  ): Promise<void> {
    const backend = await this.routeFound;
    return backend.authCreateAccount(newUser, password);
  }

  getUser(id?: UserId): Subscribable<User | null> {
    return createSubscribable(async (next) => {
      const backend = await this.routeFound;
      backend.getUser(id).subscribe(next);
    });
  }

  getUserActivity(user: UserId): Subscribable<boolean | null> {
    return createSubscribable(async (next) => {
      const backend = await this.routeFound;
      backend.getUserActivity(user).subscribe(next);
    });
  }

  getDMs(): Subscribable<DmChannel[]> {
    return createSubscribable(async (next) => {
      const backend = await this.routeFound;
      backend.getDMs().subscribe(next);
    });
  }

  getPublicChannels(): Subscribable<PublicChannelListing[]> {
    return createSubscribable(async (next) => {
      const backend = await this.routeFound;
      backend.getPublicChannels().subscribe(next);
    });
  }

  async joinChannel<JoinInfo extends ChannelJoinInfo>(
    info: JoinInfo
  ): Promise<string | null> {
    const backend = await this.routeFound;
    return backend.joinChannel(info);
  }

  getChannels(): Subscribable<Channel[]> {
    return createSubscribable(async (next) => {
      const backend = await this.routeFound;
      backend.getChannels().subscribe(next);
    });
  }

  async clearCache(): Promise<void> {
    const backend = await this.routeFound;
    return backend.clearCache();
  }

  async connectChannel(id: number): Promise<ChannelBackend | null> {
    const backend = await this.routeFound;
    return backend.connectChannel(id);
  }

  getChannel(id: number): Subscribable<Channel | null> {
    return createSubscribable(async (next) => {
      const backend = await this.routeFound;
      backend.getChannel(id).subscribe(next);
    });
  }
}
