import { PropertyType, PropertyTypeMap } from "../Entity";

export default abstract class BaseValidator<Type extends PropertyType> {
  /**
   * Validates a value.
   * @throws if the value is invalid.
   * @param value The value to validate
   */
  abstract validate(value: PropertyTypeMap[Type]): void;

  abstract autoAssign(): PropertyTypeMap[Type] | null;
}
