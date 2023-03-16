import { compareSync, hashSync } from "bcryptjs";
import jwtPrivateKey from "../../../jwt.key?raw";
import User, { UserState } from "../../model/user";
import {
  ApiActionArguments,
  ApiActionResponses,
  ApiActionType,
} from "../../shared/apiActions";
import { ConversationDatabaseHandle } from "../database";
import DatabaseUser from "../database/model/User";
import { generateJWT } from "../utils";

// TODO: Decide on a better JWT expiration date
const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

type ActionMap = {
  [Key in ApiActionType]: (
    arg: ApiActionArguments[Key]
  ) => ApiActionResponses[Key];
};

export default function getActionHandler<T extends ApiActionType>(
  database: ConversationDatabaseHandle,
  actionType: T,
  enableBcrypt: () => void,
  _userId: number | null
): ActionMap[T] {
  const map: ActionMap = {
    [ApiActionType.CreateAccount]({
      email,
      name,
      nickname,
      profilePicture,
      password,
    }) {
      const existingUser = database.simpleSearch.user({ email })[0] as
        | DatabaseUser
        | undefined;
      if (existingUser) return null;
      enableBcrypt();
      const passwordHash = hashSync(password);
      const newUser = database.createEntity.user({
        banner: null,
        email,
        id: undefined,
        isService: false,
        name,
        nickname,
        passwordHash,
        profilePicture,
        serviceOwner: null,
        state: UserState.Normal,
        status: false,
      });
      newUser.save();
      const userFromId = (id: number) => {
        const user = database.simpleSearch.user({ id })[0] as
          | DatabaseUser
          | undefined;
        if (!user) throw new Error("Can't get user");
        return user;
      };
      return newUser.toSharedModel(userFromId) as User;
    },
    [ApiActionType.LogIn]({ email, password }) {
      enableBcrypt();
      const user = database.simpleSearch.user({ email })[0] as
        | DatabaseUser
        | undefined;
      if (user && compareSync(password, user.properties.passwordHash)) {
        return generateJWT(
          { sub: String(user.properties.id) },
          jwtPrivateKey,
          new Date(new Date().getTime() + EXPIRATION_TIME)
        );
      }
      return null;
    },
    [ApiActionType.LogOut]() {
      // TODO: Update session accordingly
      // This may not be possible if we're using JWTs and the token should just
      // be removed from the client.
      // @see https://stackoverflow.com/q/21978658
      return true;
    },
  };
  return map[actionType];
}
