import BaseValidator from "./BaseValidator";

export default class EmailValidator extends BaseValidator<"string"> {
  autoAssign(): string | null {
    return null;
  }

  validate(value: string) {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      throw new Error(
        `${this.constructor.name}: Failed to validate "${value}": does not match email regex`
      );
    }
  }
}
