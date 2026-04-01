"use client";

import { Customer, Entitlement } from "@/components/providers/payload-types";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { DataTableFilterDropdownText } from "@/components/refine-ui/data-table/data-table-filter";
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
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Badge } from "@repo/ui/components/ui/badge";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/ui/button";
import { DollarSignIcon } from "lucide-react";

export default function MemberList() {
  const tenant = useWithTenant();
  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        // Column for ID field
        id: "id",
        accessorKey: "id", // Maps to the 'id' field in your data
        header: "#",
        maxSize: 40,
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
          const customer = props.row.original;
          return (
            <div className="flex gap-2">
              <div>
                <Avatar>
                  <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <Link
                  href={`members/edit/${customer.id}`}
                  className="hover:underline"
                >
                  {props.renderValue() as string}
                </Link>
                <div className="text-xs text-muted-foreground">
                  {customer.memberId}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: "plan",
        accessorKey: "plan",
        header: ({ column, table }) => (
          <div className="flex items-center gap-1">
            <span>Plan</span>
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
        cell: (props) => {
          const customer = props.row.original;
          const product = customer.member;
          const orderId = customer.member?.orderId;
          const status = product?.status;

          if (!product) return null;

          return (
            <div className="flex gap-2 items-center">
              <div className="text-sm">{product?.name}</div>
              <Badge
                variant={"outline"}
                className={cn(
                  status === "paid" && "text-green-500",
                  status === "waiting" && "text-orange-500",
                )}
              >
                {status}
              </Badge>
              {status === "waiting" && (
                <Button size={"xs"} asChild={true}>
                  <Link href={`/orgs/${tenant.id}/invoices/${orderId}/pay`}>
                    <DollarSignIcon />
                    Pay Now
                  </Link>
                </Button>
              )}
            </div>
          );
        },
      },
      {
        // Column for status field
        id: "updatedAt",
        accessorKey: "updatedAt", // Maps to the 'status' field in your data
        header: "Valid until",
        cell(props) {
          const customer = props.row.original;
          const entitlement = customer.member as Entitlement | undefined;
          return dayjs(entitlement?.endAt).format("MMM DD, YYYY");
        },
      },
    ],
    [],
  );

  const table = useTable<Customer>({
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
