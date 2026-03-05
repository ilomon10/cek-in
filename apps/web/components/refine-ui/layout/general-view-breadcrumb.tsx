"use client";

import { Fragment, useMemo } from "react";
import { Home } from "lucide-react";
import { BreadcrumbsType } from "@refinedev/core";
import {
  BreadcrumbSeparator as ShadcnBreadcrumbSeparator,
  BreadcrumbItem as ShadcnBreadcrumbItem,
  BreadcrumbList as ShadcnBreadcrumbList,
  BreadcrumbPage as ShadcnBreadcrumbPage,
  Breadcrumb as ShadcnBreadcrumb,
} from "@repo/ui/components/ui/breadcrumb";
import Link from "next/link";

type GeneralViewBreadcrumbProps = {
  breadcrumbs?: BreadcrumbsType[];
};

export function GeneralViewBreadcrumb(props: GeneralViewBreadcrumbProps) {
  const breadcrumbs = props.breadcrumbs || [];

  const breadCrumbItems = useMemo(() => {
    const list: {
      key: string;
      href: string;
      Component: React.ReactNode;
    }[] = [];

    const homePath = "/dashboard";

    list.push({
      key: "breadcrumb-item-home",
      href: homePath,
      Component: (
        <Link href={homePath}>
          <Home className="h-4 w-4" />
        </Link>
      ),
    });

    for (const { label, href } of breadcrumbs) {
      list.push({
        key: `breadcrumb-item-${label}`,
        href: href ?? "",
        Component: href ? (
          <Link href={href}>{label}</Link>
        ) : (
          <span>{label}</span>
        ),
      });
    }

    return list;
  }, [breadcrumbs, Link]);

  return (
    <ShadcnBreadcrumb>
      <ShadcnBreadcrumbList>
        {breadCrumbItems.map((item, index) => {
          if (index === breadCrumbItems.length - 1) {
            return (
              <ShadcnBreadcrumbPage key={item.key}>
                {item.Component}
              </ShadcnBreadcrumbPage>
            );
          }

          return (
            <Fragment key={item.key}>
              <ShadcnBreadcrumbItem key={item.key}>
                {item.Component}
              </ShadcnBreadcrumbItem>
              <ShadcnBreadcrumbSeparator />
            </Fragment>
          );
        })}
      </ShadcnBreadcrumbList>
    </ShadcnBreadcrumb>
  );
}
