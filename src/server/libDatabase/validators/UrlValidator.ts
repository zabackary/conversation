import { validateUrl } from "../../../shared/validation";
import BaseValidator from "./BaseValidator";

export default class UrlValidator extends BaseValidator<"string"> {
  autoAssign() {
    return null;
  }

  validate(value: string) {
    if (!validateUrl(value)) {
      throw new Error(
        `${this.constructor.name}: Failed to validate "${value}": failed shared validation`
      );
    }
  }
}
