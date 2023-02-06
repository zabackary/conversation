import { PropertyType } from "../Entity";
import BaseValidator from "./BaseValidator";

export default class Unique<
  Type extends PropertyType
> extends BaseValidator<Type> {
  validate(): boolean {
    throw new Error("Unique should be handled internally");
  }
}
