import { compareSync, hashSync } from "bcryptjs";
import User, { UserState } from "../../model/user";
import {
  ApiActionArguments,
  ApiActionResponses,
  ApiActionType,
} from "../../shared/apiActions";
import { ConversationDatabaseHandle } from "../database";

type ActionMap = {
  [Key in ApiActionType]: (
    arg: ApiActionArguments[Key]
  ) => ApiActionResponses[Key];
};

export default function getActionHandler<T extends ApiActionType>(
  database: ConversationDatabaseHandle,
  actionType: T,
  enableBcrypt: () => void
): ActionMap[T] {
  const map: ActionMap = {
    [ApiActionType.CreateAccount]({
      email,
      name,
      nickname,
      profilePicture,
      password,
    }) {
      const [existingUser] = database.simpleSearch.user({ email });
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
        const user = database.simpleSearch.user({ id })[0];
        if (!user) throw new Error("Can't get user");
        return user;
      };
      return newUser.toSharedModel(userFromId) as User;
    },
    [ApiActionType.LogIn]({ email, password }) {
      enableBcrypt();
      const [user] = database.simpleSearch.user({ email });
      if (user && compareSync(password, user.properties.passwordHash)) {
        // TODO: Update session accordingly
        return true;
      }
      return false;
    },
    [ApiActionType.LogOut]() {
      // TODO: Update session accordingly
      return true;
    },
  };
  return map[actionType];
}
