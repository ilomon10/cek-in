"use client";

import localFont from "next/font/local";
import "../globals.css";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import { dataProvider } from "@/components/providers/data-provider";
import { authProvider } from "@/components/providers/auth-provider";
import { useNotificationProvider } from "@/components/refine-ui/notification/use-notification-provider";
import { Toaster } from "@/components/refine-ui/notification/toaster";
import { Suspense } from "react";
// import { ThemeProvider } from "@/components/refine-ui/theme/theme-provider";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <ThemeProvider defaultTheme="system" storageKey="rf-ui-theme"> */}
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Suspense>
          <Refine
            options={{
              disableTelemetry: true,
            }}
            authProvider={authProvider()}
            dataProvider={dataProvider()}
            routerProvider={routerProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "tenant-users",
                list: "/orgs/:tenantId/users",
                edit: "/orgs/:tenantId/users/edit/:id",
                create: "/orgs/:tenantId/users/create",
                meta: {
                  label: "Users",
                },
              },
              {
                name: "customers",
                list: "/orgs/:tenantId/members",
                edit: "/orgs/:tenantId/members/edit/:id",
                create: "/orgs/:tenantId/members/create",
                meta: {
                  label: "Members",
                },
              },
              {
                name: "products",
                list: "/orgs/:tenantId/products",
                edit: "/orgs/:tenantId/products/edit/:id",
                create: "/orgs/:tenantId/products/create",
              },
              {
                name: "media",
                list: "/media",
                edit: "/media/edit/:id",
                create: "/media/create",
              },
            ]}
          >
            {children}
          </Refine>
          <Toaster />
        </Suspense>
      </body>
      {/* </ThemeProvider> */}
    </html>
  );
}
