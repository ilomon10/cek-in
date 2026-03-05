"use client";

import {
  BotIcon,
  CreditCardIcon,
  HomeIcon,
  ImageIcon,
  Settings2Icon,
  SquareTerminalIcon,
  Users2Icon,
  type LucideIcon,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarSeparator,
} from "@repo/ui/components/ui/sidebar";
import { FC } from "react";
import Link from "next/link";
import { checkRBAC } from "@/components/providers/utils/check-rbac";
import { useUser } from "./auth-route";

type Item = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  can: (roles: string[]) => boolean;
};

const navMain: Item[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: HomeIcon,
    can: () => true,
  },
  {
    title: "Invitations",
    url: "/invitations",
    icon: SquareTerminalIcon,
    can: (roles: string[]) => !checkRBAC(roles, ["system-admin"]),
  },
  {
    title: "Templates",
    url: "/templates",
    icon: BotIcon,
    can: (roles: string[]) => {
      return checkRBAC(roles, ["admin", "designer"]);
    },
  },
];

const navPlatform: Item[] = [
  {
    title: "Media",
    url: "/media",
    icon: ImageIcon,
    can: () => true,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCardIcon,
    can: () => true,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users2Icon,
    can: (roles: string[]) => {
      return checkRBAC(roles, ["system-admin", "admin"]);
    },
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings2Icon,
    can: () => true,
  },
];

export function NavMain() {
  const { user } = useUser();
  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          {navMain.map((item) => {
            const allowed = item.can(user?.roles as string[]);
            if (!allowed) return null;
            return <MenuButton key={item.title} item={item} />;
          })}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarSeparator className="mx-0" />
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {navPlatform.map((item) => {
            const allowed = item.can(user?.roles as string[]);
            if (!allowed) return null;
            return <MenuButton key={item.title} item={item} />;
          })}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}

const MenuButton: FC<{
  item: Item;
}> = ({ item, ...props }) => {
  return (
    <SidebarMenuButton asChild {...props} tooltip={item.title}>
      <Link href={item.url}>
        {item.icon && <item.icon />}
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  );
};
