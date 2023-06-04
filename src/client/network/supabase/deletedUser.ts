import User, { PrivilegeLevel } from "../../../model/user";

const deletedUser: User = {
  id: -1,
  isBot: false,
  name: "!translation:deleted_user",
  privilegeLevel: PrivilegeLevel.UNVERIFIED,
  disabled: false,
};

export default deletedUser;
