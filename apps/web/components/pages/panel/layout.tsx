"use client";

import { SidebarInset, SidebarProvider } from "@repo/ui/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export default function AppPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
