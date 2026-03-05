"use client";

import type { User } from "@/components/providers/payload-types";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { DataTableFilterDropdownText } from "@/components/refine-ui/data-table/data-table-filter";
import { DataTableSorter } from "@/components/refine-ui/data-table/data-table-sorter";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { useDelete } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVerticalIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function UserList() {
  const {
    mutate: deleteMutate,
    mutation: { isPending: isDeletePending },
  } = useDelete();

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "actions",
        accessorKey: "id",
        header: () => null,
        size: 24,
        maxSize: 24,
        cell: ({ cell }) => {
          const id = cell.getValue() as string;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon-sm"}>
                  {isDeletePending ? <Spinner /> : <EllipsisVerticalIcon />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Edit User</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Trash2Icon /> Delete User
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuLabel>Are you sure?</DropdownMenuLabel>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() =>
                        deleteMutate({
                          id: id,
                          resource: "users",
                        })
                      }
                    >
                      Yes
                    </DropdownMenuItem>
                    <DropdownMenuItem>Cancel</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
      {
        id: "id",
        accessorKey: "id",
        maxSize: 24,
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>ID</span>
            <DataTableSorter column={column} />
          </div>
        ),
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
        cell(props) {
          return (
            <Link
              href={`/users/edit/${props.row.original.id}`}
              className="hover:underline"
            >
              {props.renderValue() as string}
            </Link>
          );
        },
      },
      {
        // Column for status field
        id: "name",
        accessorKey: "name", // Maps to the 'status' field in your data
        header: "Name",
      },
      {
        // Column for status field
        id: "roles",
        accessorKey: "roles", // Maps to the 'status' field in your data
        header: "Roles",
      },
    ],
    []
  );

  const table = useTable<User>({
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
