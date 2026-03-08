"use client";

import { useParsed } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Redirect, useUser } from "./auth-route";
import { useTenant } from "@/components/hooks/use-tenant";
import { isEmpty } from "lodash";
import { LoadingPage } from "../loading-page";

export default function AuthOrgsRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const parsed = useParsed();
  const { query, result: tenant } = useTenant();

  const pathname = `${parsed.pathname}`.replace(/(\?.*|#.*)$/, "");

  if (query.isLoading) {
    return <LoadingPage label="Fetching your business information" />;
  }

  if (isEmpty(tenant)) {
    if (pathname !== "/orgs/0/dashboard") {
      return (
        <Redirect
          config={{
            to: "/orgs/0/dashboard",
          }}
        />
      );
    }
  }

  return children;
}
