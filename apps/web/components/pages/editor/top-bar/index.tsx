import * as React from "react";
import { WithEditor } from "@grapesjs/react";
import { cn } from "@repo/ui/lib/utils";
import { TopBarLeftButtons } from "./top-bar-left-buttons";
import { TopBarRightButtons } from "./top-bar-right-buttons";
import { DeviceSelector } from "./device-selector";

export default function Topbar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("gjs-top-sidebar flex items-center p-1 h-11", className)}
    >
      <WithEditor>
        {/* <TopMenuBar /> */}
        <TopBarLeftButtons />
        <div className="grow">
          <DeviceSelector />
        </div>
        <TopBarRightButtons />
      </WithEditor>
    </div>
  );
}
