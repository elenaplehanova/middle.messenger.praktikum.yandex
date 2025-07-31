import type { Indexed } from "@/utils/set";

export function isIndexed(value: unknown): value is Indexed {
  return (
    typeof value === "object" &&
    value !== null &&
    value.constructor === Object &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}

function isArray(value: unknown): value is [] {
  return Array.isArray(value);
}

export function isArrayOrObject(value: unknown): value is [] | Indexed {
  return isIndexed(value) || isArray(value);
}

export function isEqual(lhs: unknown, rhs: unknown): boolean {
  if (isIndexed(lhs) && isIndexed(rhs)) {
    const lhsKeys = Object.keys(lhs);
    const rhsKeys = Object.keys(rhs);

    if (lhsKeys.length !== rhsKeys.length) {
      return false;
    }

    for (const key of lhsKeys) {
      if (!rhsKeys.includes(key)) {
        return false;
      }

      if (!isEqual(lhs[key], rhs[key])) {
        return false;
      }
    }

    return true;
  } else if (isArray(lhs) && isArray(rhs)) {
    if (lhs.length !== rhs.length) {
      return false;
    }

    for (let i = 0; i < lhs.length; i++) {
      if (!isEqual(lhs[i], rhs[i])) {
        return false;
      }
    }

    return true;
  } else {
    return lhs === rhs;
  }
}

export default isEqual;
