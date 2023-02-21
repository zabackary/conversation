import Schema from "./Schema";

export default function makeSchema<T extends Schema>(schema: T) {
  return schema;
}
