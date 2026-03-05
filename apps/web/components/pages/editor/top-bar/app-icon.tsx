import { cn } from "@repo/ui/lib/utils";
import { DetailedHTMLProps, FC, ImgHTMLAttributes } from "react";

export const AppIcon: FC<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = ({ className, ...props }) => {
  return (
    <img
      {...props}
      className={cn("size-9 p-1", className)}
      src="/logo.svg"
      alt="logo manjo"
    />
  );
};
