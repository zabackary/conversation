import BaseValidator from "./BaseValidator";

export default class JsonValidator extends BaseValidator<"string"> {
  autoAssign(): string | null {
    return null;
  }

  validate(value: string) {
    return !/[^,:{}[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
      value.replace(/"(\\.|[^"\\])*"/g, "")
    );
  }
}
