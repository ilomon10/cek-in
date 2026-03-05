import * as React from "react";
import { SelectorsResultProps } from "@grapesjs/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { PlusIcon } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import { SelectorItem } from "./selectors-item";

export default function SelectorManager({
  selectors,
  selectedState,
  states,
  targets,
  setState,
  addSelector,
  removeSelector,
}: Omit<SelectorsResultProps, "Container">) {
  const addNewSelector = () => {
    const next = selectors.length + 1;
    addSelector({ name: `new-${next}` });
  };

  const targetStr = targets.join(", ");

  return (
    <div className="gjs-custom-selector-manager p-2 flex flex-col gap-2 text-left">
      <div className="flex items-center">
        <div className="flex-grow">Selectors</div>
        <Select
          value={selectedState}
          onValueChange={(value) => setState(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="state" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem value={String(state.id)} key={state.id}>
                {state.getName()}
              </SelectItem>
            ))}
            <Separator />
            <Button
              className="w-full px-2"
              variant={"ghost"}
              size={"sm"}
              onClick={(e) => {
                e.stopPropagation();
                setState("");
              }}
            >
              Clear
            </Button>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2 flex-wrap p-2 border rounded min-h-[45px]">
        {targetStr ? (
          <Button
            type="button"
            size={"icon-sm"}
            variant={"outline"}
            onClick={addNewSelector}
          >
            <PlusIcon size={0.7} />
          </Button>
        ) : (
          <div className="opacity-70">Select a component</div>
        )}
        {selectors.map((selector) => (
          <SelectorItem
            key={selector.toString()}
            selector={selector}
            onAdd={addSelector}
            onRemove={() => removeSelector(selector)}
          />
        ))}
      </div>
      <div>
        Selected: <span className="opacity-70">{targetStr || "None"}</span>
      </div>
    </div>
  );
}
