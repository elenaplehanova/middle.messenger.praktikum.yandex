import type { Indexed } from "@/utils/set";

function cloneDeep<T>(obj: T): T {
  function _cloneDeep(item: unknown): unknown {
    if (item === null || typeof item !== "object") {
      return item;
    }

    if (item instanceof Date) {
      return new Date(item.valueOf());
    }

    if (Array.isArray(item)) {
      return item.map(_cloneDeep);
    }

    if (item instanceof Set) {
      const copy = new Set();
      item.forEach((v) => copy.add(_cloneDeep(v)));
      return copy;
    }

    if (item instanceof Map) {
      const copy = new Map();
      item.forEach((v, k) => copy.set(k, _cloneDeep(v)));
      return copy;
    }

    const copy: Indexed = {};

    Object.getOwnPropertySymbols(item).forEach((s) => {
      copy[s.toString()] = _cloneDeep((item as Record<symbol, unknown>)[s]);
    });

    Object.keys(item).forEach((k) => {
      copy[k] = _cloneDeep((item as Indexed)[k]);
    });

    return copy;
  }

  return _cloneDeep(obj) as T;
}

export default cloneDeep;
