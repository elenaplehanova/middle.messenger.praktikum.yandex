type StringIndexed = Record<string, any>;

const obj: StringIndexed = {
  key: 1,
  key2: "test",
  key3: false,
  key4: true,
  key5: [1, 2, 3],
  key6: { a: 1 },
  key7: { b: { d: 2 } }
};

function queryStringify(data: StringIndexed): string | never {
  if (typeof data !== "object") {
    throw new Error("Data must be object");
  }

  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    const value = data[key];
    const endLine = index < keys.length - 1 ? "&" : "";

    if (Array.isArray(value)) {
      const arrayValue = value.reduce<StringIndexed>(
        (result, arrData, index) => ({
          ...result,
          [`${key}[${index}]`]: arrData
        }),
        {}
      );

      return `${result}${queryStringify(arrayValue)}${endLine}`;
    }

    if (typeof value === "object") {
      const objValue = Object.keys(value || {}).reduce<StringIndexed>(
        (result, objKey) => ({
          ...result,
          [`${key}[${objKey}]`]: value[objKey]
        }),
        {}
      );

      return `${result}${queryStringify(objValue)}${endLine}`;
    }

    return `${result}${key}=${value}${endLine}`;
  }, "");
}

export default queryStringify
