"use client";

import {
  SidebarMenu as SBMenu,
  SidebarMenuButton,
} from "@repo/ui/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";
import { useEditorMaybe } from "@grapesjs/react";

export function SidebarFooterMenu() {
  const editor = useEditorMaybe();
  const handleCommandButton = (cmd: string) => {
    if (!editor) return;
    editor.Commands.run(cmd);
  };
  return (
    <SBMenu>
      <SidebarMenuButton
        title="Exit Editor"
        tooltip={{
          children: "Exit Editor",
        }}
        onClick={() => {
          handleCommandButton("core:exit-project");
        }}
      >
        <LogOutIcon className="-scale-x-100" />
      </SidebarMenuButton>
    </SBMenu>
  );
}
