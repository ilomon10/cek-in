"use client";

import {
  SidebarGroup,
  SidebarMenu as SBMenu,
  SidebarMenuButton,
} from "@repo/ui/components/ui/sidebar";
import {
  Layers3Icon,
  PlusSquareIcon,
  Rows4Icon,
  VariableIcon,
} from "lucide-react";
import { useLeftSidebarContext } from "./left-sidebar-provider";

export function SidebarMenu() {
  const { toggle, isSelected } = useLeftSidebarContext();
  return (
    <SidebarGroup>
      <SBMenu>
        <SidebarMenuButton
          tooltip={{
            children: "Blocks",
          }}
          isActive={isSelected("blocks")}
          onClick={() => {
            toggle("blocks");
          }}
        >
          <PlusSquareIcon />
        </SidebarMenuButton>
        <SidebarMenuButton
          tooltip={{
            children: "Section",
          }}
          isActive={isSelected("section")}
          onClick={() => {
            toggle("section");
          }}
        >
          <Rows4Icon />
        </SidebarMenuButton>
        <SidebarMenuButton
          tooltip={{
            children: "Layers",
          }}
          isActive={isSelected("layers")}
          onClick={() => {
            toggle("layers");
          }}
        >
          <Layers3Icon />
        </SidebarMenuButton>
        <SidebarMenuButton
          tooltip={{
            children: "Data Sources",
          }}
          isActive={isSelected("data-sources")}
          onClick={() => {
            toggle("data-sources");
          }}
        >
          <VariableIcon />
        </SidebarMenuButton>
      </SBMenu>
    </SidebarGroup>
  );
}
