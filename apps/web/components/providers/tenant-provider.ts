"use client";

import { useParams } from "next/navigation";
import { dataProvider } from "./data-provider";
import { Tenant } from "./payload-types";
import { useGetIdentity } from "@refinedev/core";

export type TenantProvider = {
  getTenant: () => Promise<Tenant>;
  // login: (params: any) => Promise<AuthActionResponse>;
  // logout: (params: any) => Promise<AuthActionResponse>;
  // check: (params?: any) => Promise<CheckResponse>;
  // onError: (error: any) => Promise<OnErrorResponse>;
  // register?: (params: any) => Promise<AuthActionResponse>;
  // forgotPassword?: (params: any) => Promise<AuthActionResponse>;
  // updatePassword?: (params: any) => Promise<AuthActionResponse>;
  // getPermissions?: (
  //   params?: Record<string, any>,
  // ) => Promise<PermissionResponse>;
  // getIdentity?: (params?: any) => Promise<IdentityResponse>;
};

export const tenantProvider = (): TenantProvider => {
  const urlParams = useParams<{ tenantId?: string }>();
  const tenantId = urlParams.tenantId ? Number(urlParams.tenantId) : null;

  return {
    async getTenant(): Promise<Tenant> {
      const res = await dataProvider().getOne({
        resource: "tenants",
        id: tenantId as any,
      });
      console.log("RES", res);
      return res.data as Tenant;
    },
  };
};
