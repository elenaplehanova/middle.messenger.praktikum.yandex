import type { Indexed } from "@/utils/set";

function queryStringify(data: Indexed): string | never {
  if (typeof data !== "object" || !data) {
    throw new Error("Data must be object");
  }

  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    const value = data[key];
    const endLine = index < keys.length - 1 ? "&" : "";

    if (Array.isArray(value)) {
      const arrayValue = value.reduce<Indexed>(
        (result, arrData: unknown, index) => ({
          ...result,
          [`${key}[${index}]`]: arrData,
        }),
        {}
      );

      return `${result}${queryStringify(arrayValue)}${endLine}`;
    }

    if (typeof value === "object" && value !== null) {
      const objValue: Indexed = Object.keys(value).reduce((acc, objKey) => {
        const nestedValue = (value as Indexed)[objKey];
        acc[`${key}[${objKey}]`] = nestedValue;
        return acc;
      }, {} as Indexed);

      return `${result}${queryStringify(objValue)}${endLine}`;
    }

    return `${result}${encodeURIComponent(key)}=${encodeURIComponent(String(value))}${endLine}`;
  }, "");
}

export default queryStringify;
