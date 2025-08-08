class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function take<T>(list: T[], num: number = 1): T[] {
  if (!Array.isArray(list) || typeof num !== "number") {
    throw new ValidationError("bad value");
  }

  return list.slice(0, num);
}

export default take;
