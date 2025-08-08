import cloneDeep from "./cloneDeep";

function omit<T extends object>(obj: T, fields: (keyof T)[]): T {
  const result = {} as T;
  const keysToOmit = new Set(fields);

  for (const key in obj) {
    if (!keysToOmit.has(key)) {
      result[key] = cloneDeep(obj[key]);
    }
  }

  return result;
}

export default omit;
