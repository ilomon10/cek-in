import { APP_DESCRIPTION, APP_NAME } from "@/components/constants";
import { ForgotPasswordForm } from "@/components/refine-ui/form/forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: APP_NAME || "Forgot Password - Undangon",
  description: APP_DESCRIPTION || "Digital Invitation",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <ForgotPasswordForm />
    </div>
  );
}
