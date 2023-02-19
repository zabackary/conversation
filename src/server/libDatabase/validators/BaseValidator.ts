import { PropertyType, PropertyTypeMap } from "../Entity";

export default abstract class BaseValidator<Type extends PropertyType> {
  abstract validate(value: PropertyTypeMap[Type]): boolean;

  abstract autoAssign(): PropertyTypeMap[Type] | null;
}
