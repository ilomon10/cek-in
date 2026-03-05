import * as React from "react";
import { BlocksResultProps } from "@grapesjs/react";
import { cn } from "@repo/ui/lib/utils";

export type CustomBlockManagerProps = Pick<
  BlocksResultProps,
  "mapCategoryBlocks" | "dragStart" | "dragStop"
>;

export default function BlockManager({
  mapCategoryBlocks,
  dragStart,
  dragStop,
}: CustomBlockManagerProps) {
  // console.log(mapCategoryBlocks);
  return (
    <div className="gjs-custom-block-manager text-left">
      <div className="h-11 border-b flex items-center p-2 text-sm font-medium">
        Blocks
      </div>
      {Array.from(mapCategoryBlocks).map(([category, blocks]) => (
        <div key={category} className="border-b">
          <div className={"text-sm p-2 border-b"}>{category}</div>
          <div className="grid grid-cols-2 gap-2 p-2">
            {blocks.map((block) => (
              <div
                key={block.getId()}
                draggable
                className={cn(
                  "flex flex-col items-center border rounded cursor-pointer py-2 px-5 transition-colors"
                )}
                onDragStart={(ev) => dragStart(block, ev.nativeEvent)}
                onDragEnd={() => dragStop(false)}
              >
                <div
                  className="h-10 w-10"
                  dangerouslySetInnerHTML={{ __html: block.getMedia()! }}
                />
                <div
                  className="text-sm text-center w-full"
                  title={block.getLabel()}
                >
                  {block.getLabel()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
