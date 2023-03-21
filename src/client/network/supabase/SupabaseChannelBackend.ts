import { RealtimeChannel } from "@supabase/supabase-js";
import Message from "../../../model/message";
import NetworkBackend, {
  ChannelBackend,
  ChannelBackendEvent,
  SentMessageEvent,
} from "../network_definitions";
import convertMessage from "./converters/convertMessage";
import getMessages from "./getters/getMessages";
import { ConversationSupabaseClient, promiseFromSubscribable } from "./utils";

// TODO: Make this global so we can listen to updates when ex. the tab is
// minimized.

export default class SupabaseChannelBackend implements ChannelBackend {
  private channel: RealtimeChannel;

  constructor(
    private id: number,
    private userId: string,
    private backend: NetworkBackend,
    private client: ConversationSupabaseClient
  ) {
    this.channel = this.client.channel("table-db-changes");
  }

  connected = false;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.channel
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          ({ new: message }) => {
            void (async () => {
              if (message.channel_id === this.id) {
                const user = await promiseFromSubscribable(
                  this.backend.getUser(message.user_id as string)
                );
                const newMessage = {
                  user,
                  parent: this.id,
                  sent: new Date(message.sent_at as string),
                  isService: false, // TODO: this is an assumption
                  id: message.id as number,
                  markdown: message.markdown as string,
                  attachments: [],
                  images: [],
                  replied: undefined, // TODO: use message.replying_to
                } satisfies Message;
                for (const listener of this.listeners) {
                  listener({
                    type: "message",
                    newMessage,
                  });
                }
              }
            })();
          }
        )
        .subscribe((status, err) => {
          switch (status) {
            case "CHANNEL_ERROR":
            case "TIMED_OUT":
              reject(err);
              break;
            case "SUBSCRIBED":
              this.connected = true;
              resolve();
              break;
            case "CLOSED":
            default:
              console.log("Closed");
              break;
          }
        });
    });
  }

  async disconnect(): Promise<void> {
    const status = await this.channel.unsubscribe();
    if (status !== "ok") {
      throw status;
    }
  }

  async listMessages(): Promise<Message[]> {
    return Promise.all(
      (await getMessages(this.client, this.id)).map((message) =>
        convertMessage(message, (id) =>
          promiseFromSubscribable(this.backend.getUser(id))
        )
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
    await this.client.from("messages").insert({
      channel_id: this.id,
      markdown: message.markdown,
      user_id: this.userId,
    });
  }
}
