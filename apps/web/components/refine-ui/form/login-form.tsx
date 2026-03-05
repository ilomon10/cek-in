"use client";

import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@repo/ui/components/ui/field";
import { Input } from "@repo/ui/components/ui/input";
import { useState } from "react";
import { useLogin, useNotification, useRefineOptions } from "@refinedev/core";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { APP_NAME } from "@/components/constants";
import Image from "next/image";
import logo from "@/public/logo.svg";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [rememberMe, _setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { open } = useNotification();
  const searchparams = useSearchParams();
  const redirectTo = searchparams.get("to") || "/dashboard";

  const { mutate: login, isPending } = useLogin();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(
      {
        provider: "local",
        email,
        password,
        rememberMe,
        redirectTo,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            // console.log("success", data);
            // open?.({
            //   type: "success",
            //   message: "Success",
            // });
          }
        },
      }
    );
  };

  const handleSignInWithGoogle = () => {
    login({
      provider: "google",
      redirectTo,
    });
  };

  const handleSignInWithGitHub = () => {
    login({
      provider: "github",
      redirectTo,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSignIn}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-12 items-center justify-center rounded-md">
                <Image src={logo} alt="Undangon" />
              </div>
              <span className="sr-only">{APP_NAME}</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to {APP_NAME}</h1>
            <FieldDescription>
              Don&apos;t have an account? <Link href="/register">Sign up</Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email or Username</FieldLabel>
            <Input
              id="email"
              placeholder="member@example.com or member"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Field>
            <Button type="submit">Login</Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field className="grid gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              type="button"
              onClick={handleSignInWithGitHub}
            >
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.5 1.25C5.66797 1.25 1.75 5.26563 1.75 10.2227C1.75 14.1875 4.25781 17.5469 7.73438 18.7344C8.17188 18.8164 8.33203 18.5391 8.33203 18.3008C8.33203 18.0859 8.32422 17.5234 8.32031 16.7734C5.88672 17.3164 5.37109 15.5703 5.37109 15.5703C4.97266 14.5352 4.39844 14.2578 4.39844 14.2578C3.60547 13.6992 4.45703 13.7109 4.45703 13.7109C5.33594 13.7734 5.79688 14.6367 5.79688 14.6367C6.57812 16.0078 7.84375 15.6133 8.34375 15.3828C8.42188 14.8047 8.64844 14.4062 8.89844 14.1836C6.95703 13.957 4.91406 13.1875 4.91406 9.75C4.91406 8.76953 5.25391 7.96875 5.8125 7.34375C5.72266 7.11719 5.42188 6.20312 5.89844 4.96875C5.89844 4.96875 6.63281 4.72656 8.30469 5.88672C9.00391 5.6875 9.75 5.58984 10.4961 5.58594C11.2383 5.58984 11.9883 5.6875 12.6875 5.88672C14.3594 4.72656 15.0898 4.96875 15.0898 4.96875C15.5664 6.20312 15.2656 7.11719 15.1758 7.34375C15.7344 7.97266 16.0742 8.77344 16.0742 9.75C16.0742 13.1953 14.0273 13.9531 12.0781 14.1758C12.3906 14.4531 12.6719 15 12.6719 15.8359C12.6719 17.0352 12.6602 18.0039 12.6602 18.2969C12.6602 18.5352 12.8164 18.8164 13.2617 18.7266C16.7461 17.543 19.25 14.1836 19.25 10.2227C19.25 5.26563 15.332 1.25 10.5 1.25Z"
                  fill="currentColor"
                />
              </svg>
              Continue with Github
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleSignInWithGoogle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
