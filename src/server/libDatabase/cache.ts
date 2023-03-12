let cachedCache: GoogleAppsScript.Cache.Cache | undefined;

export function putCacheSheetRowContent(
  sheet: string,
  row: number,
  rowContent: unknown[]
) {
  const cache = cachedCache || CacheService.getScriptCache();
  cache.put(
    `${__BUILD_TIMESTAMP__}:${sheet}__${row}`,
    `${new Date().getTime()};${JSON.stringify(rowContent)}`
  );
}

export function getCachedSheetRowContent(sheet: string, row: number) {
  const cache = cachedCache || CacheService.getScriptCache();
  const value = cache.get(`${__BUILD_TIMESTAMP__}:${sheet}__${row}`);
  return value
    ? (JSON.parse(value.slice(value.indexOf(";") + 1)) as unknown[])
    : null;
}

export function isStale(sheet: string, row: number, lastKnownGood: Date) {
  const cache = cachedCache || CacheService.getScriptCache();
  const lastChanged = Number(
    cache.get(`${__BUILD_TIMESTAMP__}:${sheet}__${row}`)?.split(";")[0]
  );
  return lastChanged > lastKnownGood.getTime();
}
