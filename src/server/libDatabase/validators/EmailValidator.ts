import BaseValidator from "./BaseValidator";

export default class EmailValidator extends BaseValidator<"string"> {
  autoAssign(): string | null {
    return null;
  }

  validate(value: string) {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
  }
}
