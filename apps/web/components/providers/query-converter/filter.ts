type RefineFilter = {
  field: string;
  operator: string;
  value?: any;
};

type CrudFilter =
  | RefineFilter
  | { operator: "and" | "or"; value: CrudFilter[] };

const operatorMap: Record<string, string> = {
  eq: "equals",
  ne: "not_equals",
  lt: "less_than",
  lte: "less_than_equal",
  gt: "greater_than",
  gte: "greater_than_equal",
  in: "in",
  nin: "not_in",
  contains: "contains",
  ncontains: "not_equals", // Payload doesn't have ncontains directly; we'll emulate
  between: "between", // not native; we'll handle manually later
  null: "exists",
  nnull: "exists",
  startswith: "like",
  endswith: "like",
};

export function convertRefineFilterToPayload(
  filters?: CrudFilter[]
): Record<string, any> | undefined {
  if (!filters || filters.length === 0) return undefined;

  const build = (f: CrudFilter): any => {
    if ("operator" in f && (f.operator === "and" || f.operator === "or")) {
      return { [f.operator]: f.value.map(build) };
    }
    return convertSingleFilter(f as RefineFilter);
  };

  const result = filters.map(build);
  return result.length === 1 ? result[0] : { and: result };
}

export function convertSingleFilter(filter: RefineFilter): Record<string, any> {
  const { field, operator, value } = filter;

  switch (operator) {
    case "ncontains":
      return { [field]: { not_equals: value } };
    case "null":
      return { [field]: { exists: false } };
    case "nnull":
      return { [field]: { exists: true } };
    default:
      const mapped = operatorMap[operator] || "equals";
      return { [field]: { [mapped]: value } };
  }
}

// const operatorMap: Record<string, string> = {
//   eq: "equals",
//   ne: "not_equals",
//   lt: "less_than",
//   lte: "less_than_equal",
//   gt: "greater_than",
//   gte: "greater_than_equal",
//   in: "in",
//   nin: "not_in",
//   ina: "all",
//   contains: "contains",
//   ncontains: "not_in",
//   containss: "like",
//   ncontainss: "not_in",
//   startswith: "like",
//   endswith: "like",
//   null: "exists",
//   nnull: "exists",
// };
