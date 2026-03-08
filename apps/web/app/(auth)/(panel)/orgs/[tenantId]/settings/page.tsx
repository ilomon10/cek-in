"use client";

import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { useForm } from "react-hook-form";
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
import { ApplicationSettings } from "@/components/pages/panel/settings/application-settings";

export default function SettingsPage() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      username: "",
    },
  });

  const handleSubmit = () => {};

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
                <Link href="/">
                  <HomeIcon className="size-4" />
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Settings</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className={"flex gap-1 items-center justify-between -ml-2.5 px-11"}>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={router.back}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">Settings</h2>
        </div>

        <div className="flex items-center gap-2">
          <RefreshButton variant="outline" />
        </div>
      </div>
      <LoadingOverlay loading={form.formState.isSubmitting}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="px-11 flex flex-col gap-5"
          >
            <Separator />

            <ApplicationSettings />
          </form>
        </Form>
      </LoadingOverlay>
    </div>
  );
}
