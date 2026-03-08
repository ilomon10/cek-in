"use client";

import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { useCreate } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { User } from "@/components/providers/payload-types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/ui/form";
import * as z from "zod";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsItem,
  TagsTrigger,
  TagsValue,
} from "@repo/ui/components/ui/tags";
import useSelections from "@/components/hooks/use-selections";
import { useRouter } from "next/navigation";
import { ROLE_OPTIONS } from "@/components/constants";

const userSchema = z.object({
  email: z.email(),
  username: z.string(),
  password: z.string(),
  roles: z.array(z.number()).optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserCreatePage() {
  const router = useRouter();
  const {
    mutate,
    mutation: { isPending },
  } = useCreate<UserFormData>({
    resource: "users",
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      username: "",
    },
  });

  const selection = useSelections(ROLE_OPTIONS);

  const handleSubmit = (values: UserFormData) => {
    console.log(values);
    mutate(
      { values },
      {
        onSettled(data: unknown) {
          const { id } = data as User;
          router.replace(`/users/show/${id}`);
        },
      }
    );
  };

  return (
    <CreateView>
      <CreateViewHeader />
      <LoadingOverlay loading={isPending}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="px-4 flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <Separator />

            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <Tags>
                      <TagsTrigger>
                        {selection.selected.map((role) => (
                          <TagsValue
                            key={role.value}
                            onRemove={() => selection.unSelect(role)}
                          >
                            {role.label}
                          </TagsValue>
                        ))}
                      </TagsTrigger>
                      <TagsContent>
                        <TagsEmpty />
                        {ROLE_OPTIONS.map((role) => (
                          <TagsItem
                            key={role.value}
                            value={role.value}
                            onSelect={() => selection.select(role)}
                          >
                            {role.label}
                          </TagsItem>
                        ))}
                      </TagsContent>
                    </Tags>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </Form>
      </LoadingOverlay>
    </CreateView>
  );
}
