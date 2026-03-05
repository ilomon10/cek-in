"use client";

import { useForm as useFormDispatch } from "@refinedev/core";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@repo/ui/components/ui/form";
import { useForm } from "react-hook-form";
import { User } from "@/components/providers/payload-types";
import { Separator } from "@repo/ui/components/ui/separator";
import { ROLE_OPTIONS } from "@/components/constants";
import { Button } from "@repo/ui/components/ui/button";
import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import { FormInput } from "@/components/pages/panel/form-input";

const userSchema = z.object({
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

type UserFormData = z.infer<typeof userSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function UserEdit() {
  // const router = useRouter();
  const { id } = useParams();
  const {
    onFinish,
    formLoading,
    mutation: { isPending, mutate },
    query,
  } = useFormDispatch<UserFormData>({
    redirect: "list",
    resource: "users",
    action: "edit",
    id: id as string,
  });

  const defaultValues = query?.data?.data as unknown as User;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const handleSubmit = (values: UserFormData) => {
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
    form.reset({
      email: defaultValues.email || "",
      name: defaultValues.name || "",
      username: defaultValues.username || "",
      roles: defaultValues.roles || [],
    });
  }, [defaultValues]);

  return (
    <EditView>
      <EditViewHeader />
      <LoadingOverlay loading={formLoading}>
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
            className="px-12 flex flex-col gap-5 mb-36"
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
    </EditView>
  );
}
