import * as React from "react";
import {
  SelectorsProvider,
  StylesProvider,
  TraitsProvider,
} from "@grapesjs/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { BrushIcon, CogIcon } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import SelectorManager from "./selector-manager";
import StyleManager from "./style-manager";
import { Separator } from "@repo/ui/components/ui/separator";
import TraitManager from "./trait-manager";

export default function RightSidebar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Tabs defaultValue="styles" className={cn("gjs-right-sidebar", className)}>
      <TabsList className="flex shrink-0 w-full h-11 border-b rounded-none">
        <TabsTrigger value="styles" title="Styles">
          <BrushIcon />
          Style
        </TabsTrigger>
        <TabsTrigger value="settings" title="Settings">
          <CogIcon />
          Properties
        </TabsTrigger>
      </TabsList>
      <ScrollArea className={"flex-grow h-[1px]"}>
        <TabsContent value="styles" forceMount={true}>
          <SelectorsProvider>
            {(props) => <SelectorManager {...props} />}
          </SelectorsProvider>
          <Separator />
          <StylesProvider>
            {(props) => <StyleManager {...props} />}
          </StylesProvider>
        </TabsContent>
        <TabsContent value="settings">
          <TraitsProvider>
            {(props) => <TraitManager {...props} />}
          </TraitsProvider>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}
