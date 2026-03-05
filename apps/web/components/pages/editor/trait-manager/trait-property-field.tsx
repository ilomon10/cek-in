import * as React from "react";
import { useEditor } from "@grapesjs/react";
import type { Trait } from "grapesjs";
import { Input } from "@repo/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { InputColor } from "@repo/ui/components/ui/seragam/input-color";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";

interface StylePropertyFieldProps extends React.HTMLProps<HTMLDivElement> {
  trait: Trait;
}

export default function TraitPropertyField({
  trait,
  ...rest
}: StylePropertyFieldProps) {
  const editor = useEditor();
  const handleChange = (value: string) => {
    trait.setValue(value);
  };

  const onChange = (ev: any | string) => {
    if (typeof ev !== "object") {
      handleChange(ev);
    } else {
      handleChange(ev.target.value);
    }
  };

  const handleButtonClick = () => {
    const command = trait.get("command");
    if (command) {
      typeof command === "string"
        ? editor.runCommand(command)
        : command(editor, trait);
    }
  };

  const type = trait.getType();
  const defValue = trait.getDefault() || trait.attributes.placeholder;
  const value = trait.getValue();
  const valueWithDef = typeof value !== "undefined" ? value : defValue;

  let inputToRender = (
    <Input
      placeholder={defValue}
      value={value}
      onChange={onChange}
      className="w-full"
    />
  );

  switch (type) {
    case "select":
      {
        inputToRender = (
          <Select
            value={value}
            onValueChange={(value) => {
              if ([false, "null"].indexOf(value) > -1) {
                onChange(value);
              } else if ([false, "", "null"].indexOf(value) > -1) {
                onChange(undefined);
              } else {
                onChange(value);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={trait.getName()} />
            </SelectTrigger>
            <SelectContent>
              {trait.getOptions().map((option) => (
                <SelectItem
                  key={trait.getOptionId(option)}
                  value={trait.getOptionId(option)}
                >
                  {trait.getOptionLabel(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      break;
    case "color":
      {
        inputToRender = (
          <InputColor
            placeholder={defValue}
            value={value}
            onChange={onChange}
          />
        );
      }
      break;
    case "checkbox":
      {
        inputToRender = (
          <Checkbox
            checked={value}
            onCheckedChange={(value) => trait.setValue(value)}
          />
        );
      }
      break;
    case "button":
      {
        inputToRender = (
          <Button className="w-full" onClick={handleButtonClick}>
            {trait.getLabel()}
          </Button>
        );
      }
      break;
  }

  return (
    <div {...rest} className={cn("mb-3 px-1 w-full")}>
      <div className={cn("flex mb-2 items-center")}>
        <div className="flex-grow capitalize">{trait.getLabel()}</div>
      </div>
      {inputToRender}
    </div>
  );
}
