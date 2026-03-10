import { APP_DESCRIPTION, APP_NAME } from "@/components/constants";
import AuthOrgsRouteLayout from "@/components/pages/panel/auth-orgs-route";
import AuthRouteLayout from "@/components/pages/panel/auth-route";
import AppPanelLayout from "@/components/pages/panel/layout";
import { ThemeProvider } from "@/components/refine-ui/theme/theme-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: APP_NAME || "Panel - Cek In",
  description: APP_DESCRIPTION || "Digital Invitation",
};

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="rf-ui-theme">
      <AuthRouteLayout>
        <AuthOrgsRouteLayout>
          <AppPanelLayout>{children}</AppPanelLayout>
        </AuthOrgsRouteLayout>
      </AuthRouteLayout>
    </ThemeProvider>
  );
}
