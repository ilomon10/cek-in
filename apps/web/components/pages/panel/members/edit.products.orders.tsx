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
  CheckCircle2Icon,
  ContainerIcon,
  CrownIcon,
  DollarSignIcon,
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
import { Button } from "@repo/ui/components/ui/button";
import { useParams } from "next/navigation";
import MemberEditProductOrderPaymentForm from "./edit.products.orders.payment";

export type OrderResponse = Pick<
  Order,
  | "tenant"
  | "customer"
  | "invoiceNumber"
  | "items"
  | "updatedAt"
  | "status"
  | "totalAmount"
>;

export default function MemberEditProductsOrdersForm() {
  const { id: memberId } = useParams<{ id: string }>();
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
      populate: {
        tenant: { id: true },
        customer: { id: true },
      },
      select: {
        tenant: true,
        customer: true,
        items: true,
        updatedAt: true,
        status: true,
        invoiceNumber: true,
        totalAmount: true,
      },
    },
  });

  if (isUndef(memberId)) {
    return null;
  }

  if (!isFetching && orders.data.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 pl-12">
      <Label>Invoices</Label>
      <ItemGroup className="max-w-lg light">
        {isFetching && (
          <OrderItem
            skeleton={true}
            order={
              {
                items: [{ product: { productType: "" } }] as any,
                updatedAt: "",
                status: "paid",
                invoiceNumber: "",
              } as any
            }
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
  order: OrderResponse;
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
          {dayjs(order.updatedAt).format("MMM D, YYYY")}
        </div>

        <Badge
          variant={"outline"}
          className={cn(
            "capitalize",
            order.status === "paid" && "text-green-600 border-green-600",
            order.status === "pending" && "text-orange-500 border-orange-500",
          )}
        >
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
      {order.status === "pending" && (
        <ItemContent>
          <MemberEditProductOrderPaymentForm order={order} />
        </ItemContent>
      )}
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
