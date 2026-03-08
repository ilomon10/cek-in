"use client";

import React, { ComponentProps, useMemo } from "react";
import {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users2Icon,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@repo/ui/components/ui/sidebar";
import { useApiUrl } from "@refinedev/core";
import {
  Media,
  Tenant,
  TenantUser,
} from "@/components/providers/payload-types";
import { useUser } from "./auth-route";
import { useTenants } from "@/components/hooks/use-tenant";
import { useParams } from "next/navigation";

type User = {
  name: string;
  email: string;
  avatar: string;
  role: string;
};

// This is sample data.
const menu = ({
  tenants,
}: {
  user: User;
  tenants: Tenant[];
  roles: string[];
}) => {
  const navTeams = tenants.map(({ name, logoUrl, subscriptionPlan }) => ({
    name: name,
    logo: logoUrl,
    plan: subscriptionPlan,
  }));

  return {
    teams: navTeams,
  };
};

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const ApiUrl = useApiUrl();
  const { user: userCtx } = useUser();
  const tenants = useTenants();

  const user: User | null = useMemo(() => {
    if (!userCtx) return null;
    const url = new URL(ApiUrl);
    const avatarAsset = userCtx.avatarAsset as Media;
    return {
      name: userCtx.name || userCtx.username,
      email: userCtx.email as string,
      role: userCtx.tenantUser?.role || "staff",
      avatar:
        (avatarAsset && `${url.origin}${avatarAsset.thumbnailURL}`) ||
        "https://placehold.co/64x64",
    };
  }, [userCtx]);

  const menuItems = useMemo<any>(() => {
    if (!user) return {};
    return menu({
      user: user,
      tenants: tenants,
      roles: [user.role],
    });
  }, [user, tenants]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b h-16 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <TeamSwitcher teams={menuItems.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
