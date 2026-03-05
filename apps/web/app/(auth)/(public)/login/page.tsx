import { APP_DESCRIPTION, APP_NAME } from "@/components/constants";
import { LoginForm } from "@/components/refine-ui/form/login-form";
import { cn } from "@repo/ui/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: APP_NAME || "Login - Undangon",
  description: APP_DESCRIPTION || "Digital Invitation",
};

export default function LoginPage() {
  return (
    <div
      className={cn(
        "flex",
        "items-center",
        "justify-center",
        "h-screen",
        "w-screen"
      )}
    >
      <LoginForm />
    </div>
  );
}
