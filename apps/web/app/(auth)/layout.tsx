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
                name: "users",
                list: "/users",
                edit: "/users/edit/:id",
                create: "/users/create",
              },
              {
                name: "templates",
                list: "/templates",
                edit: "/templates/edit/:id",
                create: "/templates/create",
              },
              {
                name: "invitations",
                list: "/invitations",
                edit: "/invitations/edit/:id",
                create: "/invitations/create",
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
