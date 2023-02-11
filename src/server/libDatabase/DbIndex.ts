import { PropertyType } from "./Entity";

export default interface DbIndex {
  type: PropertyType;
  target: string;
}
