import { Button, ButtonProps } from "@repo/ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { FC, PropsWithChildren } from "react";

type TopBarButtonProps = {
  label: string;
  buttonProps: ButtonProps;
};

export const TopBarButton: FC<PropsWithChildren<TopBarButtonProps>> = ({
  children,
  label,
  buttonProps,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button {...buttonProps}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};
