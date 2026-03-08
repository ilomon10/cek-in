"use client";

import { Media, Template, User } from "@/components/providers/payload-types";
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
import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";

export default function AssetList() {
  const columns = useMemo<ColumnDef<Media>[]>(
    () => [
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
        id: "thumbnailURL",
        accessorKey: "thumbnailURL",
        header: "Thumbnail",
        maxSize: 75,
        cell(props) {
          const alt = props.row.original.alt;
          const url =
            props.row.original.thumbnailURL || props.row.original.url || "";
          return (
            <AspectRatio ratio={1}>
              <img src={url} alt={alt} />
            </AspectRatio>
          );
        },
      },
      {
        id: "alt",
        accessorKey: "alt",
        header: ({ column, table }) => (
          <div className="flex items-center gap-1">
            <span>Alt</span>
            <div>
              <DataTableFilterDropdownText
                defaultOperator="contains"
                column={column}
                table={table}
                placeholder="Filter by alt"
              />
            </div>
          </div>
        ),
      },
      {
        id: "url",
        accessorKey: "url",
        header: ({ column, table }) => (
          <div className="flex items-center gap-1">
            <span>Url</span>
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
          const url = props.renderValue() as string;
          return (
            <Link href={`${url}`} className="hover:underline">
              {url}
            </Link>
          );
        },
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Created at",
        cell(props) {
          const media = props.row.original;
          return dayjs(media.createdAt).format("DD-MM-YYYY HH:mm:ss");
        },
      },
    ],
    []
  );

  const table = useTable<Media>({
    columns,
  });

  return (
    <ListView>
      <ListViewHeader />
      <div className="px-11 pb-20">
        <DataTable table={table} />
      </div>
    </ListView>
  );
}
