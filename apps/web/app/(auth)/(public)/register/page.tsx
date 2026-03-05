import { APP_DESCRIPTION, APP_NAME } from "@/components/constants";
import { RegisterFormPage } from "@/components/refine-ui/form/register-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: APP_NAME || "Register - Undangon",
  description: APP_DESCRIPTION || "Digital Invitation",
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <RegisterFormPage />
    </div>
  );
}
