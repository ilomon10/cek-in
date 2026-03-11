import { useWithTenant } from "@/components/hooks/use-tenant";
import { Product } from "@/components/providers/payload-types";
import { useList } from "@refinedev/core";
import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import { Button } from "@repo/ui/components/ui/button";
import {
  ContainerIcon,
  CrownIcon,
  LucideIcon,
  PlusIcon,
  TicketIcon,
} from "lucide-react";
import { FC, useMemo } from "react";
import { MEMBERSHIP_DURATIONS } from "../products/create.membership";
import { toCurrency } from "@/components/utils/toCurrency";
import Link from "next/link";
import { useParams } from "next/navigation";

export const MemberCreateProductSelector: FC<{
  value: Product["id"];
  onSelect: (value: Product["id"]) => void;
}> = ({ value, onSelect }) => {
  const tenant = useWithTenant();
  const { tenantId } = useParams();

  const { result } = useList<Product>({
    resource: "products",
    filters: [
      {
        field: "tenant",
        operator: "eq",
        value: tenant.id,
      },
    ],
  });

  const products = useMemo(() => {
    return result.data.map(({ id, name, config, price }) => {
      const type = config?.type;
      const result = {
        id,
        name,
        product: name,
        price,
      };
      switch (type) {
        case "membership":
          const membership = MEMBERSHIP_DURATIONS.find(
            ({ value }) => config?.duration_days === value,
          );
          result.product = membership?.label || name;
          break;
      }
      return result;
    });
  }, [result]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map(({ id, name, product, price }) => {
        return (
          <AspectRatio key={id} ratio={16 / 9}>
            <Button
              type="button"
              variant={value === id ? "default" : "outline"}
              className="size-full justify-start"
              onClick={() => onSelect(id)}
            >
              <span className="flex flex-col items-start gap-2">
                <span className="font-semibold text-md">{name}</span>
                <span>{product}</span>
                <span className="font-semibold text-lg">
                  {toCurrency(price)}
                </span>
              </span>
            </Button>
          </AspectRatio>
        );
      })}
      <AspectRatio ratio={16 / 9}>
        <Button
          type="button"
          variant={"outline"}
          className="size-full border-dashed border-3"
          asChild
        >
          <Link href={`/orgs/${tenantId}/products/create`}>
            <PlusIcon className="size-6" />
            <span className="text-lg">Add Product</span>
          </Link>
        </Button>
      </AspectRatio>
    </div>
  );
};
