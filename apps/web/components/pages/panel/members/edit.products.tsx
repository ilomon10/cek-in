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
  Product,
} from "@/components/providers/payload-types";
import { ContainerIcon, CrownIcon, TicketIcon } from "lucide-react";
import { Separator } from "@repo/ui/components/ui/separator";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import { QRCode } from "@repo/ui/components/ui/shadcn-io/qr-code";
import { Label } from "@repo/ui/components/ui/label";
import { useParams } from "next/navigation";

export default function MemberEditProductsForm() {
  const { id: memberId } = useParams<{ id: string }>();
  const {
    query: { isFetching },
    result: products,
  } = useList<Entitlement>({
    resource: "entitlements",
    filters: [
      {
        field: "customer",
        operator: "eq",
        value: memberId,
      },
      {
        field: "status",
        operator: "eq",
        value: "active",
      },
    ],
    meta: {
      populate: {
        products: {
          productType: true,
        },
        customers: {
          name: true,
        },
      },
      select: {
        qrCode: true,
        customer: true,
        product: true,
        startAt: true,
        endAt: true,
      },
    },
  });

  if (isUndef(memberId)) {
    return null;
  }

  if (!isFetching && products.data.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 pl-12">
      <Label>Current Holding</Label>
      <ItemGroup className="grid grid-cols-2 max-w-lg light">
        {isFetching && (
          <ProductItem
            skeleton={true}
            entitlement={{
              qrCode: "",
              customer: {} as any,
              product: {} as any,
              startAt: "",
              endAt: "",
            }}
          />
        )}
        {!isFetching &&
          products.data.map((entitlement) => {
            const key = entitlement.id;
            return <ProductItem key={key} entitlement={entitlement} />;
          })}
      </ItemGroup>
    </div>
  );
}

const ProductItem = ({
  skeleton = false,
  entitlement,
}: {
  skeleton?: boolean;
  entitlement: Pick<
    Entitlement,
    "qrCode" | "customer" | "product" | "startAt" | "endAt"
  >;
}) => {
  const qrcode = entitlement.qrCode as string;
  const customer = entitlement.customer as Customer;
  const product = entitlement.product as Product;
  // const params = useParams<{ tenantId: string }>();
  // const orderItem = entitlement.orderItem as OrderItem;

  // const imageUrl = useAsyncMemo(async () => {
  //   return `/orgs/${params.tenantId}/members/qrcode/${qrcode}`;
  // return (await new Promise((resolve, reject) => {
  //   QRCode.toDataURL(qrcode).then(resolve).catch(reject);
  // })) as string;
  // }, [qrcode]);

  return (
    <Item
      variant={"outline"}
      className="bg-background text-foreground select-none"
    >
      <ItemHeader>
        <ItemMedia variant={"image"} className="size-full">
          {skeleton ? (
            <AspectRatio>
              <Skeleton className="size-full" />
            </AspectRatio>
          ) : (
            <QRCode data={qrcode} />
          )}
        </ItemMedia>
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
          {skeleton ? <Skeleton className="w-30 h-3" /> : customer.name}
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
        <div className="text-muted-foreground">
          <span className="text-xs">Since: </span>
          {skeleton ? (
            <Skeleton className="inline-block w-10 h-6" />
          ) : (
            <span className="text-lg">
              {dayjs(entitlement.startAt).format("MM/YY")}
            </span>
          )}
        </div>
        <div className="h-6">
          <Separator orientation="vertical" />
        </div>
        <div className="text-muted-foreground">
          <span className="text-xs">Until: </span>
          {skeleton ? (
            <Skeleton className="inline-block w-10 h-6" />
          ) : (
            <span className="text-lg">
              {dayjs(entitlement.endAt).format("MM/YY")}
            </span>
          )}
        </div>
      </ItemFooter>
    </Item>
  );
};
