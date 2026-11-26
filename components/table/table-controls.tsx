"use client";

import type { ReactTable, RowData } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Features } from "./features";

type TableSearchProps<TData extends RowData> = {
  table: ReactTable<Features, TData>;
  label: string;
  placeholder: string;
};

export function TableSearch<TData extends RowData>({
  table,
  label,
  placeholder,
}: TableSearchProps<TData>) {
  return (
    <Input
      type="search"
      aria-label={label}
      placeholder={placeholder}
      className="sm:flex-1"
      value={String(table.state.globalFilter ?? "")}
      onChange={(event) => table.setGlobalFilter(event.target.value)}
    />
  );
}

type TableFilterProps<TData extends RowData> = {
  table: ReactTable<Features, TData>;
  // The id of the column to filter. It needs filterFn "equalsString".
  column: string;
  label: string;
  allLabel: string;
  options: readonly { value: string; label: string }[];
};

export function TableFilter<TData extends RowData>({
  table,
  column,
  label,
  allLabel,
  options,
}: TableFilterProps<TData>) {
  return (
    <Select
      aria-label={label}
      className="w-full sm:w-auto sm:min-w-44"
      options={[{ value: "", label: allLabel }, ...options]}
      value={String(table.getColumn(column)?.getFilterValue() ?? "")}
      onValueChange={(value) =>
        table.getColumn(column)?.setFilterValue(value || undefined)
      }
    />
  );
}
