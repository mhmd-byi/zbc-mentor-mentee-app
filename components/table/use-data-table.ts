import { useTable, type RowData, type TableOptions } from "@tanstack/react-table";
import { features, type Features } from "./features";

type DataTableOptions<TData extends RowData> = {
  data: TData[];
  columns: TableOptions<Features, TData>["columns"];
  // The text the search box looks through in each row.
  searchText: (row: TData) => string[];
};

export function useDataTable<TData extends RowData>({
  data,
  columns,
  searchText,
}: DataTableOptions<TData>) {
  return useTable<Features, TData>({
    features,
    data,
    columns,
    initialState: { pagination: { pageIndex: 0, pageSize: 20 } },
    globalFilterFn: (row, _columnId, search: string) => {
      const needle = search.trim().toLowerCase();
      return searchText(row.original).some((value) =>
        value.toLowerCase().includes(needle),
      );
    },
  });
}
