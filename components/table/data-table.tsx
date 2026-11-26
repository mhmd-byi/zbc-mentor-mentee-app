"use client";

import type { ReactTable, RowData } from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import type { Features } from "./features";

type DataTableProps<TData extends RowData> = {
  table: ReactTable<Features, TData>;
  // Column ids left out on narrow screens.
  hiddenOnPhones?: string[];
  // Singular and plural, for the count underneath.
  noun: [string, string];
  emptyMessage: string;
};

export function DataTable<TData extends RowData>({
  table,
  hiddenOnPhones = [],
  noun,
  emptyMessage,
}: DataTableProps<TData>) {
  const { rows } = table.getRowModel();
  const columnClass = (id: string) =>
    hiddenOnPhones.includes(id) ? "hidden px-4 md:table-cell" : "px-4";

  return (
    <>
      <Card className="py-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`${columnClass(header.column.id)} text-muted-foreground`}
                  >
                    <table.FlexRender header={header} />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`${columnClass(cell.column.id)} py-3`}
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {rows.length === 0 && (
          <p className="px-4 py-6 text-center text-muted-foreground">
            {emptyMessage}
          </p>
        )}
      </Card>
      <TablePagination
        count={table.getFilteredRowModel().rows.length}
        noun={noun}
        pageIndex={table.state.pagination.pageIndex}
        pageCount={table.getPageCount()}
        hasPrevious={table.getCanPreviousPage()}
        hasNext={table.getCanNextPage()}
        onPrevious={() => table.previousPage()}
        onNext={() => table.nextPage()}
      />
    </>
  );
}
