import * as React from "react";
import { PagesResultProps } from "@grapesjs/react";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { PlusIcon, Trash2Icon } from "lucide-react";
import {
  AccordionContent,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";

export default function PageManager({
  pages,
  selected,
  add,
  select,
  remove,
}: PagesResultProps) {
  const addNewPage = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextIndex = pages.length + 1;
    add({
      name: `New page ${nextIndex}`,
      component: `<h1>Page content ${nextIndex}</h1>`,
    });
  };

  return (
    <div className="gjs-custom-page-manager">
      <AccordionTrigger className="px-2 py-2 h-11 border-b rounded-none">
        <div className="flex items-center gap-2">
          Pages
          <Button
            asChild
            type="button"
            variant={"ghost"}
            size={"icon-sm"}
            className="h-6"
            onClick={addNewPage}
          >
            <span>
              <PlusIcon />
            </span>
          </Button>
        </div>
      </AccordionTrigger>
      <AccordionContent className="min-h-[230px]">
        {pages.map((page, index) => (
          <div
            key={page.getId()}
            className={cn(
              "flex items-center pr-2 border-t",
              index === 0 && "border-none"
            )}
          >
            <Button
              variant="ghost"
              className={cn(
                "flex-grow text-left justify-start",
                selected === page && "font-semibold"
              )}
              onClick={() => select(page)}
            >
              {page.getName() || "Untitled page"}
            </Button>
            <Button
              variant={selected === page ? "secondary" : "destructive"}
              size={"sm"}
              onClick={() => remove(page)}
              disabled={selected === page}
            >
              <Trash2Icon size={0.7} />
            </Button>
          </div>
        ))}
      </AccordionContent>
    </div>
  );
}
