/* eslint-disable import/prefer-default-export */
/**
 * https://stackoverflow.com/a/64123628
 *
 * @param value The value to check
 * @param enumObject The Enum to check in
 * @returns The value or `undefined` if it's not in the enum
 */
export function keepIfInEnum<T>(
  value: string,
  enumObject: { [key: string]: T }
) {
  if (Object.values(enumObject).includes(value as unknown as T)) {
    return value as unknown as T;
  }
  return undefined;
}
