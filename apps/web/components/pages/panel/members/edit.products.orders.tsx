"use client";

import { isUndef } from "@/components/hooks/utils";
import dayjs from "dayjs";
import {
  Item,
  ItemTitle,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemFooter,
  ItemGroup,
  ItemHeader,
} from "@repo/ui/components/ui/item";
import { useFormContext } from "react-hook-form";
import { useList } from "@refinedev/core";
import {
  Customer,
  Entitlement,
  Order,
  OrderItem as OrderItemType,
  Product,
} from "@/components/providers/payload-types";
import {
  ContainerIcon,
  CrownIcon,
  ReceiptIcon,
  TicketIcon,
} from "lucide-react";
import { Separator } from "@repo/ui/components/ui/separator";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import { QRCode } from "@repo/ui/components/ui/shadcn-io/qr-code";
import { Label } from "@repo/ui/components/ui/label";
import { Badge } from "@repo/ui/components/ui/badge";
import { cn } from "@repo/ui/lib/utils";

export default function MemberEditProductsOrdersForm() {
  const form = useFormContext();
  const memberId = form.watch("id");

  const {
    query: { isFetching },
    result: orders,
  } = useList<Order>({
    resource: "orders",
    filters: [
      {
        field: "customer",
        operator: "eq",
        value: memberId,
      },
    ],
    meta: {
      select: {
        customer: false,
        tenant: false,
      },
    },
  });

  if (isUndef(memberId)) {
    return null;
  }

  if (orders.data.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <Label>Invoice</Label>
      <ItemGroup className="grid grid-cols-2 max-w-lg light">
        {isFetching && (
          <OrderItem
            skeleton={true}
            order={{
              items: [{ product: { productType: "" } }] as any,
              createdAt: "",
              status: "paid",
              invoiceNumber: "",
            }}
          />
        )}
        {!isFetching &&
          orders.data.map((order) => {
            const key = order.id;
            return <OrderItem key={key} order={order} />;
          })}
      </ItemGroup>
    </div>
  );
}

const OrderItem = ({
  skeleton = false,
  order,
}: {
  skeleton?: boolean;
  order: Pick<Order, "invoiceNumber" | "items" | "createdAt" | "status">;
}) => {
  const items = order.items?.docs as OrderItemType[];
  const product = items?.[0]?.product as Product;

  return (
    <Item
      variant={"outline"}
      className="bg-background text-foreground select-none"
    >
      <ItemHeader>
        <div className="text-muted-foreground">
          {dayjs(order.createdAt).format("MMM D, YYYY")}
        </div>
        <Badge variant={"outline"} className={cn("capitalize")}>
          {order.status}
        </Badge>
      </ItemHeader>
      <ItemMedia variant={"image"} className={skeleton ? "" : "bg-muted"}>
        {skeleton ? (
          <AspectRatio>
            <Skeleton className="size-full" />
          </AspectRatio>
        ) : (
          <>
            {product.productType === "membership" && <CrownIcon />}
            {product.productType === "event" && <TicketIcon />}
            {product.productType === "package" && <ContainerIcon />}
          </>
        )}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {skeleton ? <Skeleton className="w-30 h-3" /> : product.name}
        </ItemTitle>
        {skeleton ? (
          <Skeleton className="w-20 h-3" />
        ) : (
          <ItemDescription className="text-xs capitalize -mt-1">
            {product.productType}
          </ItemDescription>
        )}
      </ItemContent>
      <ItemFooter>
        <div className="flex gap-1 items-center text-md text-muted-foreground">
          {/* <ReceiptIcon className="size-5" /> */}
          {skeleton ? (
            <Skeleton className="inline-block w-10 h-6" />
          ) : (
            <span>{order.invoiceNumber}</span>
          )}
        </div>
      </ItemFooter>
    </Item>
  );
};
