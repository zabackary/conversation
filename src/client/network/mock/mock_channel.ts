import Message from "../../../model/message";
import {
  ChannelBackend,
  ChannelBackendEvent,
  SentMessageEvent,
} from "../NetworkBackend";
import { wait } from "../utils";
import { loggedInUser, messages } from "./mock_data";

export default class MockChannelBackend implements ChannelBackend {
  connected = false;

  listeners: ((event: ChannelBackendEvent) => void)[] = [];

  // eslint-disable-next-line no-useless-constructor
  constructor(private id: number) {}

  async send(message: SentMessageEvent): Promise<void> {
    await wait();
    if ("action" in message) {
      console.warn("message.action is not handled by the mock.");
      return;
    }
    const user = loggedInUser.getSnapshot();
    if (!user) {
      console.warn("Tried to send a message while signed out");
      return;
    }
    const newMessage: Message = {
      user,
      parent: this.id,
      id: Math.floor(Math.random() * 100000),
      sent: new Date(),
      isService: false,
      markdown: message.markdown,
    };
    // @ts-ignore Shut up TypeScript, it's null thingy
    (messages[this.id] as Message[] | undefined)?.push(newMessage);
    for (const listener of this.listeners) {
      listener({
        type: "message",
        newMessage,
      });
    }
  }

  async connect(): Promise<void> {
    await wait();
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    await wait();
    this.connected = false;
  }

  async listMessages(): Promise<Message[]> {
    if (this.connected) {
      await wait();
      // @ts-ignore If this.id is in messages, then it should be OK
      return this.id in messages ? [...(messages[this.id] as Message[])] : [];
    }
    throw new Error("Must be connected to list messages.");
  }

  subscribe(callback: (event: ChannelBackendEvent) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners.splice(this.listeners.indexOf(callback), 1);
    };
  }
}
