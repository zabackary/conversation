import BaseValidator from "./BaseValidator";

export default class JsonValidator extends BaseValidator<"string"> {
  validate(value: string) {
    return !/[^,:{}[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
      value.replace(/"(\\.|[^"\\])*"/g, "")
    );
  }
}
