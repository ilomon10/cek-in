"use client";

import { useParsed } from "@refinedev/core";
import { Redirect } from "./auth-route";
import {
  TenantContextProvider,
  useTenant,
} from "@/components/hooks/use-tenant";
import { isEmpty } from "lodash";
import { LoadingPage } from "../loading-page";
import { Tenant } from "@/components/providers/payload-types";

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

  return (
    <TenantContextProvider tenant={tenant as Tenant}>
      {children}
    </TenantContextProvider>
  );
}
