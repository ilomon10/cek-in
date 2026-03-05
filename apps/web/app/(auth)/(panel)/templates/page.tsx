"use client";

import { Template, User } from "@/components/providers/payload-types";
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
import { EditIcon } from "lucide-react";

export default function TemplateList() {
  const columns = useMemo<ColumnDef<Template>[]>(
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
        // Column for title field
        id: "title",
        accessorKey: "title", // Maps to the 'title' field in your data
        header: ({ column, table }) => (
          <div className="flex items-center gap-1">
            <span>Title</span>
            <div>
              <DataTableFilterDropdownText
                defaultOperator="contains"
                column={column}
                table={table}
                placeholder="Filter by title"
              />
            </div>
          </div>
        ),
        cell(props) {
          return (
            <Link
              href={`/templates/edit/${props.row.original.id}`}
              className="hover:underline"
            >
              {props.renderValue() as string}
            </Link>
          );
        },
      },
      {
        id: "slug",
        accessorKey: "slug",
        header: ({ column, table }) => (
          <div className="flex items-center gap-1">
            <span>Slug</span>
            <div>
              <DataTableFilterDropdownText
                defaultOperator="contains"
                column={column}
                table={table}
                placeholder="Filter by slug"
              />
            </div>
          </div>
        ),
        cell(props) {
          const slug = props.renderValue() as string;
          return (
            <Link
              href={`/templates/editor/${slug}`}
              className="hover:underline flex items-center"
            >
              {slug}
              <span className="ml-1">
                <EditIcon className="size-3" />
              </span>
            </Link>
          );
        },
      },
      {
        // Column for status field
        id: "owner",
        accessorKey: "owner", // Maps to the 'status' field in your data
        header: "Owner",
        cell(props) {
          const user = props.row.original.owner as User;
          return (
            <Link href={`/users/show/${user.id}`} className="hover:underline">
              {user.email}
            </Link>
          );
        },
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
    []
  );

  const table = useTable<Template>({
    columns,
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
