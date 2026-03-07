import { APP_DESCRIPTION, APP_NAME } from "@/components/constants";
import AuthPublicRouteLayout from "@/components/pages/panel/auth-public-route";
import { TenantOnboarding } from "@/components/pages/panel/tenant-onboarding/tenant-onboarding";
import { cn } from "@repo/ui/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: APP_NAME || "Onboarding - CekIn",
  description: APP_DESCRIPTION || "Membership platform",
};

export default function OnboardingPage() {
  return (
    <AuthPublicRouteLayout>
      <div className={cn("w-full max-w-xl mx-auto")}>
        <TenantOnboarding />
      </div>
    </AuthPublicRouteLayout>
  );
}
