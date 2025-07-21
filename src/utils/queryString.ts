import type { Indexed } from "@/utils/set";
import { isArrayOrObject, isIndexed } from "./isEqual";

function getKey(key: string, parentKey?: string) {
  return parentKey ? `${parentKey}[${key}]` : key;
}

export function queryString(data: Indexed): string {
  if (!isIndexed(data)) {
    throw new Error("input must be an object");
  }

  function getParams(data: Indexed | [], parentKey?: string) {
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
    .map((arr: [string, string]) => arr.join("="))
    .join("&");
}
