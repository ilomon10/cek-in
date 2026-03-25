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
  OrderItem,
  Product,
} from "@/components/providers/payload-types";
import { CrownIcon } from "lucide-react";
import QRCode from "qrcode";
import { useMemo } from "react";
import { useAsyncMemo } from "@/components/hooks/use-async-memo";
import { Separator } from "@repo/ui/components/ui/separator";

export default function MemberEditProductsForm() {
  const form = useFormContext();
  const memberId = form.watch("id");

  const {
    query: { isLoading, isSuccess },
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
        orderItem: {
          price: true,
          invoiceNumber: true,
        },
      },
      select: {
        // customer: false,
        tenant: false,
      },
    },
  });

  if (isUndef(memberId)) {
    return null;
  }

  return (
    <ItemGroup className="grid grid-cols-2 max-w-lg">
      {products.data.map((entitlement) => {
        const key = entitlement.id;
        return <ProductItem key={key} entitlement={entitlement} />;
      })}
    </ItemGroup>
  );
}

const ProductItem = ({ entitlement }: { entitlement: Entitlement }) => {
  const qrcode = entitlement.qrCode as string;
  const customer = entitlement.customer as Customer;
  const product = entitlement.product as Product;
  // const orderItem = entitlement.orderItem as OrderItem;

  const imageUrl = useAsyncMemo(async () => {
    return (await new Promise((resolve, reject) => {
      QRCode.toDataURL(qrcode).then(resolve).catch(reject);
    })) as string;
  }, [qrcode]);

  return (
    <Item variant={"outline"}>
      <ItemHeader>
        <ItemMedia variant={"image"} className="size-full">
          <img src={imageUrl} />
        </ItemMedia>
      </ItemHeader>
      <ItemMedia variant={"image"} className="bg-muted">
        {product.productType === "membership" && <CrownIcon />}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{customer.name}</ItemTitle>
        <ItemDescription className="capitalize">
          {product.productType}
        </ItemDescription>
      </ItemContent>
      <ItemFooter>
        <div className="text-muted-foreground">
          <span className="text-xs">Since: </span>
          <span className="text-lg">
            {dayjs(entitlement.startAt).format("MM/YY")}
          </span>
        </div>
        <div className="h-6">
          <Separator orientation="vertical" />
        </div>
        <div className="text-muted-foreground">
          <span className="text-xs">Until: </span>
          <span className="text-lg">
            {dayjs(entitlement.endAt).format("MM/YY")}
          </span>
        </div>
      </ItemFooter>
    </Item>
  );
};
