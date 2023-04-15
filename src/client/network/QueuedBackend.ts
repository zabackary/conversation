/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-return-assign */
import Channel, { DmChannel, PublicChannelListing } from "../../model/channel";
import User, { NewUserMetadata, UserId } from "../../model/user";
import NetworkBackend, {
  ChannelBackend,
  ChannelJoinInfo,
  Subscribable,
} from "./NetworkBackend";
import { createSubscribable } from "./utils";

export default class QueuedBackend implements NetworkBackend {
  currentRoute: NetworkBackend | undefined;

  routeFound: Promise<NetworkBackend>;

  routeTo: (route: NetworkBackend) => void;

  isReady: Promise<void>;

  constructor() {
    let resolveRouteFound: undefined | ((route: NetworkBackend) => void);
    this.routeFound = new Promise((resolve) => {
      resolveRouteFound = resolve;
    });
    this.routeTo = (route) => {
      this.currentRoute = route;
      if (resolveRouteFound) resolveRouteFound(route);
    };
    this.isReady = new Promise((resolve) => {
      this.routeFound
        .then((route) => {
          if (route.isReady) {
            route.isReady
              .then(() => {
                resolve();
              })
              .catch(() => {
                console.error("QueuedBackend redirection failed to start");
              });
          } else {
            resolve();
          }
        })
        .catch(() => {
          console.error("Failed to start QueuedBackend");
        });
    });
  }

  private deferredSubscribable<T>(
    factory: (backend: NetworkBackend) => Subscribable<T>
  ) {
    return createSubscribable<T>(async (next) => {
      const backend = await this.routeFound;
      const subscribable = factory(backend);
      const snapshot = subscribable.getSnapshot();
      if (snapshot !== null) next(snapshot);
      subscribable.subscribe(next);
    });
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
    return this.deferredSubscribable((backend) => backend.getUser(id));
  }

  getUserActivity(user: UserId): Subscribable<boolean | null> {
    return this.deferredSubscribable((backend) =>
      backend.getUserActivity(user)
    );
  }

  getDMs(): Subscribable<DmChannel[]> {
    return this.deferredSubscribable((backend) => backend.getDMs());
  }

  getPublicChannels(): Subscribable<PublicChannelListing[]> {
    return this.deferredSubscribable((backend) => backend.getPublicChannels());
  }

  async joinChannel<JoinInfo extends ChannelJoinInfo>(
    info: JoinInfo
  ): Promise<string | null> {
    const backend = await this.routeFound;
    return backend.joinChannel(info);
  }

  getChannels(): Subscribable<Channel[]> {
    return this.deferredSubscribable((backend) => backend.getChannels());
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
    return this.deferredSubscribable((backend) => backend.getChannel(id));
  }
}
