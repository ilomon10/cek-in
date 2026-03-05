import * as React from "react";
import { BlocksProvider, LayersProvider, PagesProvider } from "@grapesjs/react";
import { cn } from "@repo/ui/lib/utils";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import BlockManager from "../blocks-manager";
import LayerManager from "../layer-manager";
import PageManager from "../page-manager";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";
import { useLeftSidebarContext } from "./left-sidebar-provider";
import { VariableManager } from "../variable-manager";
import SectionManager from "../section-manager";

export default function LeftSidebar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { selected, isSelected } = useLeftSidebarContext();

  return (
    <div
      data-selected={selected || false}
      className={cn(
        "gjs-left-sidebar flex flex-col",
        className,
        "transition-all",
        "data-[selected=false]:w-0"
      )}
    >
      {isSelected("layers") && (
        <ScrollArea className={"flex-grow h-[1px]"}>
          <Accordion type="multiple" defaultValue={["layers", "pages"]}>
            <AccordionItem value="pages">
              <PagesProvider>
                {(props) => <PageManager {...props} />}
              </PagesProvider>
            </AccordionItem>
            <AccordionItem value="layers">
              <AccordionTrigger className="px-2 py-2">
                <div className="flex items-center gap-2">Layers</div>
              </AccordionTrigger>
              <AccordionContent>
                <LayersProvider>
                  {(props) => <LayerManager {...props} />}
                </LayersProvider>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      )}
      {isSelected("blocks") && (
        <ScrollArea className={"flex-grow h-[1px]"}>
          <BlocksProvider>
            {(props) => <BlockManager {...props} />}
          </BlocksProvider>
        </ScrollArea>
      )}
      {isSelected("data-sources") && (
        <ScrollArea className={"flex-grow h-[1px]"}>
          <VariableManager />
        </ScrollArea>
      )}
      {isSelected("section") && <SectionManager />}
    </div>
  );
}
