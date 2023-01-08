export enum InvalidPasswordReason {
  TOO_LONG,
  TOO_SHORT,
}

/**
 * Validate a password and return why it failed.
 *
 * @param password The password to validate
 * @returns An `InvalidPasswordReason` if the password didn't pass or `null` if
 * the password is fine.
 */
export function validatePassword(password: string) {
  if (password.length > 512) return InvalidPasswordReason.TOO_LONG;
  if (password.length < 8) return InvalidPasswordReason.TOO_SHORT;
  return null;
}

/** Should be in the format of `[domain]|*.[valid TLD]` */
const WHITELISTED_DOMAINS = [
  "google.com",
  "desmos.com",
  "xkcd.com",
  "*.gov",
  "wikipedia.org", // Maybe ok?
  "wikimedia.org", // Maybe ok?
  "stackexchange.com",
  "stackoverflow.com",
  "*.edu", // Should be OK but not sure yet
  "zoom.us",
  "microsoft.com",
  "github.com",
  "getalma.com",
  "bing.com",
  "github.io", // Same as *.edu, might be hosting bad stuff but oh well
  "material.io",
  "grammarly.com",
];

const URL_REGEX =
  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

/**
 * Checks if a given URL is an OK one.
 *
 * @param url The URL to check against.
 * @returns A boolean indicating whether the URL is safe or `null` if it's not
 * a URL.
 */
export function validateUrl(url: string) {
  if (!URL_REGEX.test(url)) return null; // It's not even a URL. Should be fine.
  const { hostname } = new URL(url);
  for (const domain of WHITELISTED_DOMAINS) {
    if (domain[0] === "*") {
      if (hostname.slice(hostname.lastIndexOf(".")) === domain.slice(1))
        return true; // Correct TLD
    } else {
      if (hostname === domain) return true; // Exact match
      if (hostname.slice(-domain.length - 1) === `.${domain}`) return true; // Subdomain
    }
  }
  return false;
}

const SWEARS = [
  // I really don't want to fill this out so it's blank for now.
  "validationTest_swear",
];

const SLURS = [
  // Same as above... This is even worse :(
  "validationText_slur",
];

const INVALID_UNICODE_REGEX =
  // eslint-disable-next-line no-control-regex
  /[^\u0009\u000a\u000d\u0020-\uD7FF\uE000-\uFFFD]/u;

export enum InvalidTextReason {
  SWEAR,
  SLUR,
  BAD_URL,
  TOO_LONG,
  BAD_UNCIODE,
}

/**
 * Validates a piece of text.
 *
 * @param text The text to check.
 * @returns An `InvalidTextReason` if the validation failed or `null` if the text is fine.
 */
export function validateText(text: string) {
  if (text.length > 512) return InvalidTextReason.TOO_LONG;
  if (INVALID_UNICODE_REGEX.test(text)) return InvalidTextReason.BAD_UNCIODE;
  const urls = URL_REGEX.exec(text);
  for (const url of urls ?? []) {
    if (!validateUrl(url)) return InvalidTextReason.BAD_URL;
  }
  for (const swear of SWEARS) {
    if (text.includes(swear)) return InvalidTextReason.SWEAR;
  }
  for (const slur of SLURS) {
    if (text.includes(slur)) return InvalidTextReason.SLUR;
  }
  return null;
}
