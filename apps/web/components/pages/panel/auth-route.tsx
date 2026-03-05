"use client";

import { User } from "@/components/providers/payload-types";
import {
  GoConfig,
  useActiveAuthProvider,
  useGetIdentity,
  useGo,
  useIsAuthenticated,
  useParsed,
} from "@refinedev/core";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
} from "react";
import { LoadingPage } from "../loading-page";

export default function AuthRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const redirectOnFail = true;
  const activeAuthProvider = useActiveAuthProvider();
  const hasAuthProvider = Boolean(activeAuthProvider?.isProvided);
  const parsed = useParsed();
  // const go = useGo();

  const {
    isLoading,
    data: {
      authenticated: isAuthenticatedStatus,
      redirectTo: authenticatedRedirect,
    } = {},
  } = useIsAuthenticated();

  const isAuthenticated = hasAuthProvider ? isAuthenticatedStatus : true;

  if (!hasAuthProvider) {
    return "No `auth-provider` found";
  }

  if (isLoading) {
    return <LoadingPage label="Authenticating" />;
  }

  if (isAuthenticated) {
    return <UserContextProvider>{children ?? null}</UserContextProvider>;
  }

  const appliedRedirect =
    typeof redirectOnFail === "string"
      ? redirectOnFail
      : (authenticatedRedirect as string | undefined);

  const pathname = `${parsed.pathname}`.replace(/(\?.*|#.*)$/, "");

  if (appliedRedirect) {
    // Prevent redirect loop: only redirect to login if not already there
    if (pathname !== "/login") {
      return (
        <Redirect
          config={{
            to: "/login",
            query: {
              to: pathname,
            },
            type: "replace",
          }}
        />
      );
    } else {
      // Already at login, don't redirect again
      return null;
    }
  }
  return null;
}

const Redirect = ({ config }: { config: GoConfig }) => {
  const go = useGo();

  useEffect(() => {
    go(config);
  }, [go, config]);

  return null;
};

const UserContext = createContext<{ user: User | null } | undefined>(undefined);

const UserContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data: user, isLoading, refetch } = useGetIdentity<User>();

  // Refetch user identity on mount to ensure fresh state after login
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <LoadingPage description="Fetching user data" />;
  if (!user) return null;
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("`useUser()` must be in <AuthRouteLayout/>");
  }
  return context;
};

export const WithUser: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useUser();
  if (!user) return null;
  return children;
};
