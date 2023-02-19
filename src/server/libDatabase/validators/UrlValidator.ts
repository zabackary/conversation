import { validateUrl } from "../../../shared/validation";
import BaseValidator from "./BaseValidator";

export default class UrlValidator extends BaseValidator<"string"> {
  autoAssign() {
    return null;
  }

  validate(value: string) {
    return !!validateUrl(value);
  }
}
