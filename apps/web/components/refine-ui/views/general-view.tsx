"use client";

import { cn } from "@repo/ui/lib/utils";
import { BreadcrumbsType, useBack } from "@refinedev/core";
import type { PropsWithChildren } from "react";
import { Separator } from "@repo/ui/components/ui/separator";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { SidebarTrigger } from "@repo/ui/components/ui/sidebar";
import { GeneralViewBreadcrumb } from "../layout/general-view-breadcrumb";

type GeneralViewProps = PropsWithChildren<{
  className?: string;
}>;

export function GeneralView({ children, className }: GeneralViewProps) {
  return (
    <div className={cn("flex flex-col", "gap-4", className)}>{children}</div>
  );
}

type GeneralHeaderProps = PropsWithChildren<{
  title?: string;
  wrapperClassName?: string;
  headerClassName?: string;
  breadcrumbs?: BreadcrumbsType[];
  enableBackButton?: boolean;
}>;

export const GeneralViewHeader = ({
  title: titleFromProps,
  wrapperClassName,
  headerClassName,
  breadcrumbs,
  enableBackButton = true,
}: GeneralHeaderProps) => {
  const back = useBack();

  const title = titleFromProps;

  return (
    <div className={cn("flex flex-col", "gap-4", wrapperClassName)}>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] border-b ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <GeneralViewBreadcrumb
            breadcrumbs={breadcrumbs || [{ label: title || "" }]}
          />
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
        {enableBackButton && (
          <Button variant="ghost" size="icon" onClick={back}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
    </div>
  );
};
