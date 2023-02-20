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

/**
 * https://stackoverflow.com/a/51399781
 *
 * Convert an `Array` to its element type.
 */
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/**
 * `cyrb53` (c) 2018 [bryc](github.com/bryc)
 *
 * A fast and simple hash function with decent collision resistance.
 * Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
 * Public domain. Attribution appreciated.
 */
export function cyrb53(str: string, seed = 0) {
  /* eslint-disable no-bitwise */
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i += 1) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return (
    (h2 >>> 0).toString(16).padStart(8, "0") +
    (h1 >>> 0).toString(16).padStart(8, "0")
  );
  /* eslint-enable no-bitwise */
}
