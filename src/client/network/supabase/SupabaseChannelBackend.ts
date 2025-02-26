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

  /**
   * The sent date of the earliest known message in this channel.
   *
   * `undefined` - hasn't loaded yet.
   * `null` - we've seen all messages.
   * `instanceof Date` - has message.
   */
  private earliestKnownMessageDate?: Date | null;

  async fetchHistory(): Promise<Message[] | null> {
    if (this.earliestKnownMessageDate === null) {
      return null;
    }
    if (this.earliestKnownMessageDate === undefined) {
      throw new Error("Must list messages before fetching history");
    }
    return this.listMessages(this.earliestKnownMessageDate);
  }

  async listMessages(lastDate = new Date()): Promise<Message[]> {
    const messages = await Promise.all(
      (
        await getMessages(
          this.backend.client,
          this.cache,
          this.id,
          30,
          lastDate
        )
      ).map(async (dbMessage) => {
        const message = await convertMessage(dbMessage, (id) =>
          promiseFromSubscribable(this.backend.getUser(id))
        );
        return message;
      })
    );
    this.earliestKnownMessageDate = messages[0]?.sent ?? null;
    return messages;
  }

  listeners: ((event: ChannelBackendEvent) => void)[] = [];

  subscribe(callback: (event: ChannelBackendEvent) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners.splice(this.listeners.indexOf(callback), 1);
    };
  }

  private async processUpload(
    cache: SupabaseCache,
    messageId: number,
    file: File,
    asImage: boolean
  ) {
    let imageWidth;
    let imageHeight;
    if (asImage) {
      const objectURL = URL.createObjectURL(file);
      const image = new Image();
      image.src = objectURL;
      try {
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
        });
      } catch (e) {
        console.warn("Failed to load image to retrieve dimensions:", e);
      }
      imageWidth = image.naturalWidth;
      imageHeight = image.naturalHeight;
      URL.revokeObjectURL(objectURL);
    }
    const { error, data } = await this.backend.client
      .from("attachments")
      .insert({
        message_id: messageId,
        last_modified: new Date(file.lastModified).toISOString(),
        mime_type: file.type,
        name: file.name,
        as_image: asImage,
        upload_url: null,
        image_width: imageWidth,
        image_height: imageHeight,
      })
      .select("*");
    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attachment = data[0]!;
    cache.putAttachment(attachment);
    const attachmentId = attachment.id;
    this.backend.client.storage
      .from(UPLOAD_BUCKET)
      .upload(`${attachmentId}/${file.name}`, file)
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
        // TODO: Update internal cached attachment
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
          return this.processUpload(this.cache, messageId, attachment, false);
        })
      );
    if (message.images)
      await Promise.all(
        message.images.map((image) => {
          return this.processUpload(this.cache, messageId, image, true);
        })
      );
  }
}
