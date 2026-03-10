"use client";

import { TenantUser } from "@/components/providers/payload-types";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { DataTableFilterDropdownText } from "@/components/refine-ui/data-table/data-table-filter";
import { DataTableSorter } from "@/components/refine-ui/data-table/data-table-sorter";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo } from "react";
import dayjs from "dayjs";
import { useWithTenant } from "@/components/hooks/use-tenant";

export default function MemberList() {
  const tenant = useWithTenant();
  const columns = useMemo<ColumnDef<TenantUser>[]>(
    () => [
      {
        // Column for ID field
        id: "id",
        accessorKey: "id", // Maps to the 'id' field in your data
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
                placeholder="Filter by name"
              />
            </div>
          </div>
        ),
        cell(props) {
          return (
            <Link
              href={`members/edit/${props.row.original.id}`}
              className="hover:underline"
            >
              {props.renderValue() as string}
            </Link>
          );
        },
      },
      {
        id: "email",
        accessorKey: "email",
        header: ({ column, table }) => (
          <div className="flex items-center gap-1">
            <span>Email</span>
            <div>
              <DataTableFilterDropdownText
                defaultOperator="contains"
                column={column}
                table={table}
                placeholder="Filter by email"
              />
            </div>
          </div>
        ),
      },
      {
        id: "role",
        accessorKey: "role",
        header: ({ column, table }) => (
          <div className="flex items-center gap-1">
            <span>Role</span>
            <div>
              <DataTableFilterDropdownText
                defaultOperator="contains"
                column={column}
                table={table}
                placeholder="Filter by email"
              />
            </div>
          </div>
        ),
      },
      {
        // Column for status field
        id: "updatedAt",
        accessorKey: "updatedAt", // Maps to the 'status' field in your data
        header: "Last Update at",
        cell(props) {
          const template = props.row.original;
          return dayjs(template.updatedAt).format("DD-MM-YYYY HH:mm:ss");
        },
      },
    ],
    [],
  );

  const table = useTable<TenantUser>({
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
