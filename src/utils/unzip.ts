function unzip(...args: number[][]): number[][] {
  const maxLength = args.reduce((result, arg) => {
    if (!Array.isArray(arg)) {
      throw new Error(`${String(arg)} is not array`);
    }

    return Math.max(result, arg.length);
  }, 0);

  return Array.from({ length: maxLength }, (_, index) => {
    return args.map((arg: number[]) => arg[index]);
  });
}

export default unzip;
