import User from "./user";

export default interface Service {
  /**
   * Name of service
   */
  name: string;

  /**
   * Icon for service (shown on messages, etc.)
   */
  icon: string;

  /**
   * Banner for service (shown on info screens)
   */
  banner: string;

  /**
   * The user id of the author, or `null` if built-in.
   */
  author: User | null;
}
