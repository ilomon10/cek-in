"use client";

import { PayloadSDK } from "@payloadcms/sdk";
import type { Config } from "./payload-types";
import { SERVER_URL } from "../constants";

/**
 * Patch the `auth` shape to match what `@payloadcms/sdk` expects:
 * specifically the auth operation input shapes that require `email`.
 */
type PayloadClientAuth = {
  users: {
    forgotPassword: { email: string };
    login: { email: string; password: string };
    registerFirstUser: { email: string; password: string };
    unlock: { email: string };
  };
};

type PayloadClientConfig = Omit<Config, "auth"> & {
  auth: PayloadClientAuth;
  fallbackLocale: string;
};

export const clientSDK = () => {
  const origin =
    typeof window !== "undefined"
      ? `${window.location.origin}/api`
      : SERVER_URL;
  return new PayloadSDK<PayloadClientConfig>({
    baseURL: origin,
  });
};
