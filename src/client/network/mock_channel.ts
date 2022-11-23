import Message from "../../data/message";
import { messages } from "./mock_data";
import { wait } from "./mock_utils";
import { ChannelBackend, ChannelBackendEvent } from "./network_definitions";

export default class MockChannelBackend implements ChannelBackend {
  connected = false;

  listeners: ((event: ChannelBackendEvent) => void)[] = [];

  // eslint-disable-next-line no-useless-constructor
  constructor(private id: number) {}

  async connect(): Promise<void> {
    await wait();
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    await wait();
    this.listeners = [];
    this.connected = false;
  }

  async listMessages(): Promise<Message[]> {
    if (this.connected) {
      await wait();
      return this.id === 5
        ? [messages.rate, messages.hello, messages.cool, messages.thanks]
        : [];
    }
    throw new Error("Must be connected to list messages.");
  }

  subscribe(callback: (event: ChannelBackendEvent) => void): void {
    this.listeners.push(callback);
  }
}
