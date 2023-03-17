import BaseValidator from "./BaseValidator";

export default class DateTimeValidator extends BaseValidator<"string"> {
  validate(value: string) {
    if (
      !/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/.test(
        value
      )
    ) {
      throw new Error(
        `${this.constructor.name}: Failed to validate "${value}": does not match ISO date.`
      );
    }
  }

  static fromDate(value: Date) {
    return value.toISOString();
  }

  static toDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new Error("Date value is invalid");
    return date;
  }

  autoAssign() {
    return new Date().toISOString();
  }
}
