import { PropertyType, PropertyTypeMap } from "../Entity";
import BaseValidator from "./BaseValidator";

export default class Unique<
  Type extends PropertyType
> extends BaseValidator<Type> {
  autoAssign(): PropertyTypeMap[Type] | null {
    return null;
  }

  validate(): boolean {
    throw new Error("Unique should be handled internally");
  }
}
