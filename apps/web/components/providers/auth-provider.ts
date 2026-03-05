"use client";

import type {
  AuthActionResponse,
  AuthProvider,
  CheckResponse,
  OnErrorResponse,
} from "@refinedev/core";
import type { User } from "./payload-types";
import { clientSDK } from "./client-sdk";
import { useLocalStorage } from "../hooks/use-local-storage";
import { SERVER_URL } from "../constants";

type LoginResult = {
  exp?: number;
  message: string;
  token?: string;
  user: User;
  errors?: { message: string }[];
};

type LoginParams =
  | {
      provider: "local";
      email: string;
      password: string;
      rememberMe: boolean;
      redirectTo: string;
    }
  | { provider: "google"; redirectTo: string }
  | { provider: "github"; redirectTo: string };

type RegisterParams =
  | {
      provider: "local";
      username: string;
      email: string;
      password: string;
    }
  | { provider: "google"; redirectTo: string }
  | { provider: "github"; redirectTo: string };

export const authProvider = (): AuthProvider => {
  const client = clientSDK();
  const [token, setToken, removeToken] = useLocalStorage("undangon-token", "");
  const [tokenExpireDate, setTokenExpireDate, removeTokenExpireDate] =
    useLocalStorage<number | undefined>("undangon-token-expire", undefined);
  const result = {
    // required methods
    login: async (params: LoginParams): Promise<AuthActionResponse> => {
      let result: AuthActionResponse = {
        success: false,
        redirectTo: params.redirectTo,
      };
      try {
        if (params.provider === "local") {
          const res = (await client.login(
            {
              collection: "users",
              data: {
                email: params.email,
                password: params.password,
              },
            },
            { credentials: "include" }
          )) as LoginResult;
          if (res.errors) {
            result.success = false;
            result.error = new Error(res.errors[0]?.message);
          } else {
            result.success = true;
            result.successNotification = {
              message: "Login Successful",
              description: "You have successfully logged in.",
            };
            if (res.token) {
              setTokenExpireDate(res.exp);
              setToken(res.token);
            }
          }
        }
      } catch (err) {
        console.log("error", err);
      }
      return result;
    },
    check: async (params: any): Promise<CheckResponse> => {
      const result: CheckResponse = {
        authenticated: false,
      };

      try {
        // No token -> not authenticated
        if (!token) {
          result.redirectTo = "/login";
          return result;
        }

        const nowSec = Math.floor(Date.now() / 1000);

        // If we don't have an expiry or token is expired (or about to expire), try refresh.
        // Refresh a little earlier (30s) to avoid edge cases.
        const needsRefresh = !tokenExpireDate || nowSec > tokenExpireDate - 30;

        if (needsRefresh) {
          // Use a global/shared promise to avoid multiple concurrent refresh calls.
          const key = "__undangon_refreshPromise";
          if (!(globalThis as any)[key]) {
            (globalThis as any)[key] = client
              .refreshToken({ collection: "users" }, { credentials: "include" })
              .finally(() => {
                // cleanup promise once settled
                delete (globalThis as any)[key];
              });
          }

          const res = await (globalThis as any)[key];

          // If refresh failed, clear stored auth and redirect to login
          if ((res as any).errors || !res.refreshedToken) {
            removeToken();
            removeTokenExpireDate();
            result.authenticated = false;
            result.redirectTo = "/login";
            return result;
          }

          // Save updated token & expiry
          setToken(res.refreshedToken);
          setTokenExpireDate(res.exp);
        }

        // Token valid
        result.authenticated = true;
        return result;
      } catch (error) {
        // On error, clear tokens and require login
        removeToken();
        removeTokenExpireDate();
        result.authenticated = false;
        result.redirectTo = "/login";
        return result;
      }
    },
    logout: async (params: any): Promise<AuthActionResponse> => {
      await client.request({
        path: `/users/logout`,
        method: "POST",
        init: {
          credentials: "include",
          // headers: { Authorization: `JWT ${token}` }
        },
      });
      removeToken();
      removeTokenExpireDate();
      return {
        success: true,
      };
    },
    onError: async (params: any): Promise<OnErrorResponse> => {
      return {};
    },
    // optional methods
    register: async (params: RegisterParams): Promise<AuthActionResponse> => {
      const result: AuthActionResponse = {
        success: false,
        // redirectTo: "/dashboard",
      };
      try {
        if (params.provider === "local") {
          const res = await client.create(
            {
              collection: "users",
              data: {
                email: params.email,
                username: params.username,
                password: params.password,
                roles: ["user"],
              },
            },
            {
              credentials: "include",
            }
          );
          if (typeof res !== "undefined") {
            result.success = true;
            result.redirectTo = "/dashboard";
          }
          console.log(res);
          return result;
        } else {
          throw new Error("Invalid provider");
        }
      } catch (err) {
        return {
          success: false,
        };
      }
    },
    forgotPassword: async (params: any): Promise<AuthActionResponse> => {
      return {
        success: true,
      };
    },
    updatePassword: async (params: any): Promise<AuthActionResponse> => {
      return {
        success: true,
      };
    },
    getPermissions: async (params: any): Promise<unknown> => {
      return {
        success: true,
      };
    },
    getIdentity: async (params: any): Promise<User> => {
      await result.check(params);
      const res = await client.me(
        { collection: "users" },
        {
          // headers: { Authorization: `JWT ${token}` },
          credentials: "include",
        }
      );
      return res.user;
    },
  };
  return result;
};
