import { useWithTenant } from "@/components/hooks/use-tenant";
import { Product } from "@/components/providers/payload-types";
import { useList } from "@refinedev/core";
import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import { Button } from "@repo/ui/components/ui/button";
import { PlusIcon } from "lucide-react";
import { FC, useMemo } from "react";
import { toCurrency } from "@/components/utils/toCurrency";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductSchema } from "../products/product.schema";

export const MemberCreateProductSelector: FC<{
  value?: ProductSchema;
  onSelect: (value: Product) => void;
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
    return result.data.map((product) => {
      const { id, name, config, price } = product;
      const type = config?.type;
      const result = {
        id,
        name,
        label: name,
        price,
        type,
        product,
      };
      switch (type) {
        case "membership":
          result.label = `Duration ${config?.duration_days} days`;
          break;
      }
      return result;
    });
  }, [result]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map(({ id, name, label, product, type, price }) => {
        return (
          <AspectRatio key={id} ratio={16 / 9}>
            <Button
              type="button"
              variant={value?.id === id ? "default" : "outline"}
              className="size-full justify-start text-left"
              onClick={() => onSelect(product)}
            >
              <span className="flex flex-col items-start gap-2">
                <span className="font-semibold text-md">{name}</span>
                <span className="flex flex-col">
                  <span className="capitalize text-xs">{type}</span>
                  <span className="font-semibold text-md">{label}</span>
                </span>
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
