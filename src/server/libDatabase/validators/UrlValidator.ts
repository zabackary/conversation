import { validateUrl } from "../../../shared/validation";
import BaseValidator from "./BaseValidator";

export default class UrlValidator extends BaseValidator<"string"> {
  validate(value: string) {
    return !!validateUrl(value);
  }
}
