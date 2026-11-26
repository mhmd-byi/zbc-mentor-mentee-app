import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_equalsString,
  globalFilteringFeature,
  rowPaginationFeature,
  tableFeatures,
} from "@tanstack/react-table";

// One setup for every list: search, column filters and pages.
export const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { equalsString: filterFn_equalsString },
});

export type Features = typeof features;
