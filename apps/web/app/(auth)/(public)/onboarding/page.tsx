import { APP_DESCRIPTION, APP_NAME } from "@/components/constants";
import { TenantOnboarding } from "@/components/pages/panel/tenant-onboarding/tenant-onboarding";
import { LoginForm } from "@/components/refine-ui/form/login-form";
import { cn } from "@repo/ui/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: APP_NAME || "Onboarding - CekIn",
  description: APP_DESCRIPTION || "Membership platform",
};

export default function LoginPage() {
  return (
    <div
      className={cn(
        "flex",
        "items-center",
        "justify-center",
        "h-screen",
        "w-screen",
      )}
    >
      <TenantOnboarding />
    </div>
  );
}
