import makeSchema from "../libDatabase/makeSchema";
import Channel from "./entities/Channel";
import Member from "./entities/Member";
import Message from "./entities/Message";
import Session from "./entities/Session";
import User from "./entities/User";

export default makeSchema({
  version: 0,
  entities: {
    channel: Channel,
    member: Member,
    message: Message,
    session: Session,
    user: User,
  },
});
