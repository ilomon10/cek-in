"use client";

import { useTenant, useWithTenant } from "@/components/hooks/use-tenant";
import { Product, User } from "@/components/providers/payload-types";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { DataTableFilterDropdownText } from "@/components/refine-ui/data-table/data-table-filter";
import { DataTableSorter } from "@/components/refine-ui/data-table/data-table-sorter";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function ProductsList() {
  const tenant = useWithTenant();
  const { tenantId } = useParams();

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>ID</span>
            <DataTableSorter column={column} />
          </div>
        ),
        maxSize: 24,
      },
      {
        id: "name",
        accessorKey: "name",
        header: ({ column, table }) => (
          <div className="flex items-center gap-1">
            <span>Name</span>
            <div>
              <DataTableFilterDropdownText
                defaultOperator="contains"
                column={column}
                table={table}
                placeholder="Filter by Name"
              />
            </div>
          </div>
        ),
        cell(props) {
          return (
            <Link
              href={`/orgs/${tenantId}/products/edit/${props.row.original.id}`}
              className="hover:underline"
            >
              {props.renderValue() as string}
            </Link>
          );
        },
      },
      {
        id: "price",
        accessorKey: "price",
        header: "Price",
        cell(props) {
          return props.getValue();
        },
      },
      {
        id: "updatedAt",
        accessorKey: "updatedAt",
        header: "Last Update at",
        cell(props) {
          const template = props.row.original;
          return dayjs(template.updatedAt).format("DD-MM-YYYY HH:mm:ss");
        },
      },
    ],
    [],
  );

  const table = useTable<Product>({
    columns,
    refineCoreProps: {
      filters: {
        initial: [
          {
            field: "tenant",
            operator: "eq",
            value: tenant.id,
          },
        ],
      },
    },
  });

  return (
    <ListView>
      <ListViewHeader />
      <div className="px-11">
        <DataTable table={table} />
      </div>
    </ListView>
  );
}
