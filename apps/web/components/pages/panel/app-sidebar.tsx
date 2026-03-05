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
import { Media, Team } from "@/components/providers/payload-types";
import { useUser } from "./auth-route";
import { checkRBAC } from "@/components/providers/utils/check-rbac";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { cn } from "@repo/ui/lib/utils";

type User = {
  name: string;
  email: string;
  avatar: string;
  roles: string[];
};

// This is sample data.
const menu = ({
  user,
  teams,
  roles,
}: {
  user: User;
  teams: Team[];
  roles: string[];
}) => {
  const navTeams = [
    {
      name: `${user?.name} projects`,
      logo: user.avatar,
      plan: "Free",
    },
  ];
  const navMain = [
    {
      title: "Invitations",
      url: "/invitations",
      icon: SquareTerminal,
    },
    {
      title: "Templates",
      url: "/templates",
      icon: Bot,
    },
    {
      title: "Users",
      url: "/users",
      icon: Users2Icon,
      can: () => checkRBAC(roles, ["user", "designer"]),
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ];
  const projects = [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ];
  return {
    teams: navTeams,
    navMain,
    projects,
  };
};

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { user: userCtx } = useUser();
  const ApiUrl = useApiUrl();
  const user: User | null = useMemo(() => {
    if (!userCtx) return null;
    const url = new URL(ApiUrl);
    const avatarAsset = userCtx.avatarAsset as Media;
    return {
      name: userCtx.name || userCtx.username,
      email: userCtx.email as string,
      roles: userCtx.roles as string[],
      avatar:
        (avatarAsset && `${url.origin}${avatarAsset.thumbnailURL}`) ||
        "https://placehold.co/64x64",
    };
  }, [userCtx]);
  const menuItems = useMemo<any>(() => {
    if (!user) return {};
    return menu({
      user: user,
      teams: [],
      roles: user.roles as string[],
    });
  }, [user]);
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
