/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-return-assign */
import Channel, {
  DmChannel,
  InvitedChannelListing,
  PrivacyLevel,
  PublicChannelListing,
} from "../../model/channel";
import User, {
  NewUserMetadata,
  RegisteredUser,
  UserId,
} from "../../model/user";
import NetworkBackend, {
  ChannelBackend,
  ChannelDetails,
  ChannelJoinInfo,
  Subscribable,
} from "./NetworkBackend";

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
    this.connectionState = this.deferredSubscribable(
      (backend) => backend.connectionState
    ).map((value) => Promise.resolve(value || "connecting"), "connecting");
  }

  private deferredSubscribable<T>(
    factory: (backend: NetworkBackend) => Subscribable<T>
  ) {
    return new Subscribable<T | null>(async (next, nextError) => {
      const backend = await this.routeFound;
      const subscribable = factory(backend);
      const snapshot = subscribable.getSnapshot();
      if (snapshot !== null) next(snapshot);
      subscribable.subscribe(({ value, error }) => {
        if (!error) next(value);
        else nextError(error);
      });
    }, null);
  }

  private async deferredPromise<T>(
    factory: (backend: NetworkBackend) => Promise<T>
  ) {
    const backend = await this.routeFound;
    return factory(backend);
  }

  connectionState: Subscribable<
    "connecting" | "connected" | "reconnecting" | "error"
  >;

  getInvitedChannels(
    offset: number,
    limit: number
  ): Promise<InvitedChannelListing[]> {
    return this.deferredPromise((backend) =>
      backend.getInvitedChannels(offset, limit)
    );
  }

  addMembers(id: number, userIds: UserId[], invitation: string): Promise<void> {
    return this.deferredPromise((backend) =>
      backend.addMembers(id, userIds, invitation)
    );
  }

  removeMembers(
    id: number,
    userIds: UserId[],
    canRejoin?: boolean | undefined
  ): Promise<void> {
    return this.deferredPromise((backend) =>
      backend.removeMembers(id, userIds, canRejoin)
    );
  }

  generateLink(id: number): Promise<string> {
    return this.deferredPromise((backend) => backend.generateLink(id));
  }

  createChannel(
    name: string,
    description: string,
    privacyLevel: PrivacyLevel,
    password?: string | undefined
  ): Promise<Channel> {
    return this.deferredPromise((backend) =>
      backend.createChannel(name, description, privacyLevel, password)
    );
  }

  authLogIn(username: string, password: string): Promise<void> {
    return this.deferredPromise((backend) =>
      backend.authLogIn(username, password)
    );
  }

  authLogOut(): Promise<void> {
    return this.deferredPromise((backend) => backend.authLogOut());
  }

  authCreateAccount(newUser: NewUserMetadata, password: string): Promise<void> {
    return this.deferredPromise((backend) =>
      backend.authCreateAccount(newUser, password)
    );
  }

  getCurrentSession(): Subscribable<RegisteredUser | null> {
    return this.deferredSubscribable((backend) => backend.getCurrentSession());
  }

  getUser(id: UserId): Subscribable<User | null> {
    return this.deferredSubscribable((backend) => backend.getUser(id));
  }

  getUserActivity(user: UserId): Subscribable<boolean | null> {
    return this.deferredSubscribable((backend) =>
      backend.getUserActivity(user)
    );
  }

  getDMs(): Subscribable<DmChannel[] | null> {
    return this.deferredSubscribable((backend) => backend.getDMs());
  }

  getPublicChannels(
    offset: number,
    limit: number
  ): Promise<PublicChannelListing[]> {
    return this.deferredPromise((backend) =>
      backend.getPublicChannels(offset, limit)
    );
  }

  joinChannel<JoinInfo extends ChannelJoinInfo>(
    info: JoinInfo
  ): Promise<string | null> {
    return this.deferredPromise((backend) => backend.joinChannel(info));
  }

  getChannels(): Subscribable<Channel[] | null> {
    return this.deferredSubscribable((backend) => backend.getChannels());
  }

  clearCache(): Promise<void> {
    return this.deferredPromise((backend) => backend.clearCache());
  }

  connectChannel(id: number): Promise<ChannelBackend | null> {
    return this.deferredPromise((backend) => backend.connectChannel(id));
  }

  getChannel(id: number): Subscribable<Channel | null> {
    return this.deferredSubscribable((backend) => backend.getChannel(id));
  }

  updateChannel(id: number, details: Partial<ChannelDetails>): Promise<void> {
    return this.deferredPromise((backend) =>
      backend.updateChannel(id, details)
    );
  }

  deleteChannel(id: number): Promise<void> {
    return this.deferredPromise((backend) => backend.deleteChannel(id));
  }
}
