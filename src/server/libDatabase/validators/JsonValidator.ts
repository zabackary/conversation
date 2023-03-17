import BaseValidator from "./BaseValidator";

export default class JsonValidator extends BaseValidator<"string"> {
  autoAssign(): string | null {
    return null;
  }

  validate(value: string) {
    try {
      JSON.parse(value);
    } catch (cause) {
      throw new Error(
        `${this.constructor.name}: Failed to validate "${value}": can't parse JSON`,
        { cause }
      );
    }
  }
}
