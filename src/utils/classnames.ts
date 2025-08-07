function classNames(...args: unknown[]): string {
  const classes: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) {
      continue;
    }

    const argType = typeof arg;

    if (argType === "string" || argType === "number") {
      classes.push(JSON.stringify(arg));
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = classNames.apply(null, arg);

        if (inner) {
          classes.push(inner);
        }
      }
    } else if (argType === "object") {
      if (arg.toString !== Object.prototype.toString) {
        classes.push(JSON.stringify(arg));
      } else {
        for (let key in arg) {
          if (
            Object.prototype.hasOwnProperty.call(arg, key) &&
            Boolean((arg as Record<string, unknown>)[key])
          ) {
            classes.push(key);
          }
        }
      }
    }
  }

  return classes.join(" ");
}

export default classNames;
