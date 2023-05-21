import { SupabaseBackend } from ".";
import Message from "../../../model/message";
import {
  ChannelBackend,
  ChannelBackendEvent,
  SentMessageEvent,
} from "../NetworkBackend";
import SupabaseCache from "./cache";
import convertMessage from "./converters/convertMessage";
import getMessages from "./getters/getMessages";
import { promiseFromSubscribable } from "./utils";

const UPLOAD_BUCKET = "chat-uploads";

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
      (await getMessages(this.backend.client, this.cache, this.id, 30)).map(
        async (dbMessage) => {
          const message = await convertMessage(dbMessage, (id) =>
            promiseFromSubscribable(this.backend.getUser(id))
          );
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

  private async processUpload(messageId: number, file: File, asImage: boolean) {
    // TODO: Add `attachments` table to cache
    const { error, data } = await this.backend.client
      .from("attachments")
      .insert({
        message_id: messageId,
        last_modified: new Date(file.lastModified).toISOString(),
        mime_type: file.type,
        name: file.name,
        as_image: asImage,
        upload_url: null,
      })
      .select("id");
    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attachmentId = data[0]!.id;
    this.backend.client.storage
      .from(UPLOAD_BUCKET)
      .upload(attachmentId, file)
      .then(async ({ data: storageData, error: storageError }) => {
        // storage returns a PromiseLike without `catch`
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        const { error: updateError } = await this.backend.client
          .from("attachments")
          .update(
            storageError
              ? {
                  has_error: true,
                }
              : {
                  upload_url: this.backend.client.storage
                    .from(UPLOAD_BUCKET)
                    .getPublicUrl(storageData.path).data.publicUrl,
                }
          )
          .eq("id", attachmentId)
          .single();
        if (updateError) console.error(updateError);
      })
      .catch(() => {
        // No-op: Supabase never throws. Errors are passed via `error` in `then`
      });
  }

  async send(message: SentMessageEvent): Promise<void> {
    if ("action" in message) throw new Error("Actions are not supported yet.");
    const { error, data } = await this.backend.client
      .from("messages")
      .insert({
        channel_id: this.id,
        markdown: message.markdown,
        user_id: this.userId,
        replying_to: message.replied,
      })
      .select("id");
    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const messageId = data[0]!.id;
    if (message.attachments)
      await Promise.all(
        message.attachments.map((attachment) => {
          return this.processUpload(messageId, attachment, false);
        })
      );
    if (message.images)
      await Promise.all(
        message.images.map((image) => {
          return this.processUpload(messageId, image, true);
        })
      );
  }
}
