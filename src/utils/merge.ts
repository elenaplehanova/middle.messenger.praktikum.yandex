import type { Indexed } from "@/utils/set";

function merge(lhs: Indexed, rhs: Indexed): Indexed {
  for (let p in rhs) {
    if (!rhs.hasOwnProperty(p)) {
      continue;
    }

    if (
      typeof rhs[p] === "object" &&
      rhs[p] !== null &&
      typeof lhs[p] === "object" &&
      lhs[p] !== null
    ) {
      rhs[p] = merge(lhs[p] as Indexed, rhs[p] as Indexed);
    } else {
      lhs[p] = rhs[p];
    }
  }

  return lhs;
}

export default merge;
