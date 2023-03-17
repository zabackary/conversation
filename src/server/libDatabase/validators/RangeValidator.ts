import BaseValidator from "./BaseValidator";

export default class RangeValidator extends BaseValidator<"number"> {
  autoAssign(): number | null {
    return null;
  }

  constructor(private min: number, private max: number) {
    super();
  }

  validate(value: number) {
    if (!(value >= this.min && value <= this.max)) {
      throw new Error(
        `${this.constructor.name}: Failed to validate "${value}": is not >= ${this.min} and <= ${this.max}`
      );
    }
  }
}
