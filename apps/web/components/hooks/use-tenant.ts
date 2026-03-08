"use client";

import { useList, useOne } from "@refinedev/core";
import { useParams } from "next/navigation";
import { Tenant, TenantUser } from "../providers/payload-types";
import { useUser } from "../pages/panel/auth-route";

function isEmptyOrNull(value: any) {
  return (
    value == null || (typeof value === "string" && value.trim().length === 0)
  );
}

export const useTenant = () => {
  const urlParams = useParams<{ tenantId: string }>();
  const tenantId = Number(urlParams.tenantId);
  if (isEmptyOrNull(tenantId))
    throw new Error("`useTenant` must be in the `orgs` route");

  const { user } = useUser();

  const tenantUser = user?.tenantUsers?.docs?.[tenantId] as TenantUser;

  return useOne<Tenant>({
    resource: "tenants",
    id: tenantUser?.tenant as number,
  });
};

export const useTenants = () => {
  const urlParams = useParams<{ tenantId: string }>();
  const tenantId = Number(urlParams.tenantId);

  if (isEmptyOrNull(tenantId))
    throw new Error("`useTenant` must be in the `orgs` route");

  const { user } = useUser();
  const tenantIds = (user?.tenantUsers?.docs as TenantUser[]).map(
    ({ tenant }) => tenant as number,
  );

  const {
    query: { data },
  } = useList<Tenant>({
    resource: "tenants",
    filters: [
      {
        field: "id",
        operator: "in",
        value: tenantIds,
      },
    ],
  });

  return data?.data || [];
};
