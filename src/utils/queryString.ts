import { isArrayOrObject, isPlainObject, PlainObject } from "./isEqual";

function getKey(key: string, parentKey?: string) {
  return parentKey ? `${parentKey}[${key}]` : key;
}

export function queryString(data: PlainObject): string {
  if (!isPlainObject(data)) {
    throw new Error("input must be an object");
  }

  function getParams(data: PlainObject | [], parentKey?: string) {
    const result: [string, string][] = [];

    for (const [key, value] of Object.entries(data)) {
      if (isArrayOrObject(value)) {
        result.push(...getParams(value, getKey(key, parentKey)));
      } else {
        result.push([
          getKey(key, parentKey),
          encodeURIComponent(String(value)),
        ]);
      }
    }

    return result;
  }

  return getParams(data)
    .map((arr: any[]) => arr.join("="))
    .join("&");
}
