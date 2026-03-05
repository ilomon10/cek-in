type RefineSort = { field: string; order: "asc" | "desc" };

export function convertRefineSortToPayload(
  sort?: RefineSort[]
): string[] | undefined {
  if (!sort || sort.length === 0) return undefined;

  return sort.map(({ field, order }) =>
    order === "desc" ? `-${field}` : field
  );
}
