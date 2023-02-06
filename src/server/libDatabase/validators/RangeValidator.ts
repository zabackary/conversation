import BaseValidator from "./BaseValidator";

export default class RangeValidator extends BaseValidator<"number"> {
  constructor(private min: number, private max: number) {
    super();
  }

  validate(value: number) {
    return value >= this.min && value <= this.max;
  }
}
