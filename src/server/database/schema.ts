import makeSchema from "../libDatabase/makeSchema";
import Channel from "./model/Channel";
import Member from "./model/Member";
import Message from "./model/Message";
import Session from "./model/Session";
import User from "./model/User";

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
