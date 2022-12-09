import Message from "../../data/message";
import { messages } from "./mock_data";
import { ChannelBackend, ChannelBackendEvent } from "./network_definitions";
import { wait } from "./utils";

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
    this.connected = false;
  }

  async listMessages(): Promise<Message[]> {
    if (this.connected) {
      await wait();
      // @ts-ignore If this.id is in messages, then it should be OK
      return this.id in messages ? messages[this.id] : [];
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
