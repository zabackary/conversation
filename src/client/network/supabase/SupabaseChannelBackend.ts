import Message from "../../../model/message";
import {
  ChannelBackend,
  ChannelBackendEvent,
  SentMessageEvent,
} from "../NetworkBackend";
import convertMessage from "./converters/convertMessage";
import getMessages from "./getters/getMessages";
import { promiseFromSubscribable } from "./utils";
import { SupabaseBackend } from ".";
import SupabaseCache from "./cache";

// TODO: Make this global so we can listen to updates when ex. the tab is
// minimized.

export default class SupabaseChannelBackend implements ChannelBackend {
  constructor(
    private id: number,
    private userId: string,
    private backend: SupabaseBackend,
    private cache: SupabaseCache
  ) {}

  connected = false;

  private cancelSubscription: (() => void) | undefined;

  connect(): Promise<void> {
    return new Promise((resolve) => {
      this.cancelSubscription = this.backend.messageSubscribable.subscribe(
        ({ value, error }) => {
          if (error) {
            console.error(error);
          } else if (value?.parent === this.id) {
            for (const listener of this.listeners) {
              listener({
                type: "message",
                newMessage: value,
              });
            }
          }
        }
      );

      resolve();
    });
  }

  disconnect(): Promise<void> {
    return new Promise<void>(() => {
      this.connected = false;
      this.cancelSubscription?.call(this);
    });
  }

  async listMessages(): Promise<Message[]> {
    return Promise.all(
      (await getMessages(this.backend.client, this.id, 30)).map(
        async (dbMessage) => {
          const message = await convertMessage(dbMessage, (id) =>
            promiseFromSubscribable(this.backend.getUser(id))
          );
          this.cache.putMessage(dbMessage);
          return message;
        }
      )
    );
  }

  listeners: ((event: ChannelBackendEvent) => void)[] = [];

  subscribe(callback: (event: ChannelBackendEvent) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners.splice(this.listeners.indexOf(callback), 1);
    };
  }

  async send(message: SentMessageEvent): Promise<void> {
    if ("action" in message) throw new Error("Actions are not supported yet.");
    await this.backend.client.from("messages").insert({
      channel_id: this.id,
      markdown: message.markdown,
      user_id: this.userId,
      replying_to: message.replied,
    });
  }
}
