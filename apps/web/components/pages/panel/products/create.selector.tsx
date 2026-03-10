import { Product } from "@/components/providers/payload-types";
import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import { Button } from "@repo/ui/components/ui/button";
import { ContainerIcon, CrownIcon, LucideIcon, TicketIcon } from "lucide-react";
import { FC } from "react";

const PRODUCT_TYPES: {
  label: string;
  value: Product["productType"];
  icon: LucideIcon;
}[] = [
  { value: "membership", label: "Membership", icon: CrownIcon },
  { value: "event", label: "Event", icon: TicketIcon },
  { value: "package", label: "Package", icon: ContainerIcon },
];

export const ProductCreateSelector: FC<{
  onSelect: (value: Product["productType"]) => void;
}> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-4 px-12">
      {PRODUCT_TYPES.map(({ label, value, icon: Icon }) => (
        <AspectRatio key={value} ratio={16 / 9}>
          <Button
            variant={"outline"}
            className="size-full"
            onClick={() => onSelect(value)}
          >
            <span className="flex flex-col items-center">
              <Icon className="size-10" />
              {label}
            </span>
          </Button>
        </AspectRatio>
      ))}
    </div>
  );
};
