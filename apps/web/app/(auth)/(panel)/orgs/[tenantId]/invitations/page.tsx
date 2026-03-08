"use client";

import { Invitation, User } from "@/components/providers/payload-types";
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
import { useMemo } from "react";

export default function InvitationList() {
  const columns = useMemo<ColumnDef<Invitation>[]>(
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
              href={`/invitations/edit/${props.row.original.id}`}
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
              href={`/invitations/editor/${slug}`}
              className="hover:underline"
            >
              {slug}
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

  const table = useTable<Invitation>({
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
