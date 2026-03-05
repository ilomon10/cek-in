"use client";

import { cn } from "@repo/ui/lib/utils";
import {
  useBack,
  useResourceParams,
  useUserFriendlyName,
} from "@refinedev/core";
import type { PropsWithChildren } from "react";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Separator } from "@repo/ui/components/ui/separator";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { SidebarTrigger } from "@repo/ui/components/ui/sidebar";

type CreateViewProps = PropsWithChildren<{
  className?: string;
}>;

export function CreateView({ children, className }: CreateViewProps) {
  return (
    <div className={cn("flex flex-col", "gap-4", className)}>{children}</div>
  );
}

type CreateHeaderProps = PropsWithChildren<{
  resource?: string;
  title?: string;
  wrapperClassName?: string;
  headerClassName?: string;
}>;

export const CreateViewHeader = ({
  resource: resourceFromProps,
  title: titleFromProps,
  wrapperClassName,
  headerClassName,
}: CreateHeaderProps) => {
  const back = useBack();

  const getUserFriendlyName = useUserFriendlyName();

  const { resource, identifier } = useResourceParams({
    resource: resourceFromProps,
  });

  const title =
    titleFromProps ??
    getUserFriendlyName(
      resource?.meta?.label ?? identifier ?? resource?.name,
      "plural"
    );

  return (
    <div className={cn("flex flex-col", "gap-4", wrapperClassName)}>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] border-b ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb />
        </div>
      </header>
      <div
        className={cn(
          "flex",
          "gap-1",
          "items-center",
          "-ml-2.5",
          "px-4",
          headerClassName
        )}
      >
        <Button variant="ghost" size="icon" onClick={back}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
    </div>
  );
};

CreateView.displayName = "CreateView";
