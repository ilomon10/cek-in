"use client";

import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { useApiUrl, useForm as useFormDispatch } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { User } from "@/components/providers/payload-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@repo/ui/components/ui/form";
import * as z from "zod";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "@repo/ui/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@repo/ui/components/ui/breadcrumb";
import { ArrowLeftIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { RefreshButton } from "@/components/refine-ui/buttons/refresh";
import { FormInput } from "@/components/pages/panel/form-input";
import { ROLE_OPTIONS } from "@/components/constants";
import { useUser } from "@/components/pages/panel/auth-route";
import { useEffect } from "react";

const accountSchema = z.object({
  avatarAsset: z.string().optional(),
  name: z.string(),
  email: z.email(),
  username: z.string().min(3),
  roles: z
    .array(z.union([z.number(), z.string()]))
    .min(1)
    .optional(),
});
const passwordSchema = z.object({
  password: z.string().optional(),
  confirm_password: z.string(),
});

type AccountFormData = z.infer<typeof accountSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function AccountPage() {
  const router = useRouter();
  const { user: userCtx } = useUser();
  const apiUrl = useApiUrl();

  const {
    onFinish,
    formLoading,
    mutation: { isPending },
    query,
  } = useFormDispatch<AccountFormData>({
    redirect: false,
    resource: "users",
    action: "edit",
    id: userCtx?.id as number,
    meta: {
      depth: 1,
    },
  });

  const defaultValues = query?.data?.data as unknown as User;

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const handleSubmit = (values: AccountFormData) => {
    console.log("Submit", values);
    onFinish({
      email: values.email,
      username: values.username,
      name: values.name,
      roles: values.roles,
    });
  };

  const handleSubmitPassword = (values: PasswordFormData) => {
    console.log("Submit", values);
    onFinish({
      password: values.password,
    });
  };

  useEffect(() => {
    // if (form.formState.isDirty) return;
    if (!defaultValues) return;
    console.log(defaultValues);
    form.reset({
      email: defaultValues.email || "",
      name: defaultValues.name || "",
      username: defaultValues.username || "",
      roles: (defaultValues.roles || []) as any[],
    });
  }, [defaultValues]);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] border-b ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/dashboard">
                  <HomeIcon className="size-4" />
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Account</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className={"flex gap-1 items-center justify-between -ml-2.5 px-4"}>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={router.back}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">Account</h2>
        </div>

        <div className="flex items-center gap-2">
          <RefreshButton variant="outline" />
        </div>
      </div>
      <LoadingOverlay loading={isPending}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="px-12 flex flex-col gap-5"
          >
            <FormInput
              control={form.control}
              name="email"
              type="input"
              label="Email"
              placeholder="Enter your email"
            />
            <FormInput
              control={form.control}
              name="username"
              type="input"
              label="Username"
              placeholder="Enter your username"
            />
            <FormInput
              control={form.control}
              name="name"
              type="input"
              label="Name"
              placeholder="Enter your Name"
            />

            <FormInput
              control={form.control}
              type="tags"
              name="roles"
              label="Roles"
              placeholder="Select some roles"
              loading={!defaultValues || formLoading}
              options={ROLE_OPTIONS}
            />

            <div className="flex space-x-2">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update User"}
              </Button>
            </div>
          </form>

          <Separator className="my-6" />

          <form
            onSubmit={passwordForm.handleSubmit(handleSubmitPassword)}
            className="px-12 flex flex-col gap-5"
          >
            <h2 className="text-xl font-medium">Change password</h2>
            <FormInput
              control={passwordForm.control}
              name="password"
              type="input"
              label="New Password"
              placeholder="Enter your Password"
            />
            <FormInput
              control={passwordForm.control}
              name="password_confirm"
              type="input"
              label="Confirm Password"
              placeholder="Enter your Confirm Password"
            />
            <div className="flex space-x-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update password"}
              </Button>
            </div>
          </form>
        </Form>
      </LoadingOverlay>
    </div>
  );
}
