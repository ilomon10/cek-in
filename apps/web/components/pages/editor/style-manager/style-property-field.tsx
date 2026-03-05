import * as React from "react";
import { useEditor } from "@grapesjs/react";
import type {
  Property,
  PropertyComposite,
  PropertyNumber,
  PropertyRadio,
  PropertySelect,
  PropertySlider,
  PropertyStack,
} from "grapesjs";
import { Input } from "@repo/ui/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { Label } from "@repo/ui/components/ui/label";
import { Slider } from "@repo/ui/components/ui/slider";
import { InputColor } from "@repo/ui/components/ui/seragam/input-color";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Button } from "@repo/ui/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, XIcon } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@repo/ui/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

interface StylePropertyFieldProps extends React.HTMLProps<HTMLDivElement> {
  prop: Property;
}

export default function StylePropertyField({
  prop,
  ...rest
}: StylePropertyFieldProps) {
  const editor = useEditor();
  const handleChange = (value: string) => {
    prop.upValue(value);
    // prop.up
  };

  const onChange = (value: any) => {
    handleChange(value);
  };

  const openAssets = () => {
    const { Assets } = editor;
    Assets.open({
      select: (asset, complete) => {
        console.log({ complete });
        prop.upValue(asset.getSrc(), { partial: !complete });
        complete && Assets.close();
      },
      types: ["image"],
      accept: "image/*",
    });
  };

  const type = prop.getType();
  const defValue = prop.getDefaultValue();
  const canClear = prop.canClear();
  const hasValue = prop.hasValue();
  const value = prop.getValue();
  const valueString = hasValue ? value : "";
  const valueWithDef = hasValue ? value : defValue;

  let inputToRender = (
    <Input
      value={valueString}
      placeholder={valueWithDef}
      onChange={(e) => onChange(e.target.value)}
      className="h-8"
    />
  );

  switch (type) {
    case "number":
      {
        const property = prop as PropertyNumber;
        const units = property.getUnits();
        const unit = property.getUnit();
        const handleSelect = (unit: string) => {
          property.upUnit(unit);
        };
        inputToRender = (
          <InputGroup>
            <InputGroupInput
              value={valueString}
              placeholder={valueWithDef}
              onChange={(e) => onChange(e.target.value)}
              className="h-8"
            />
            <InputGroupAddon align={"inline-end"}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <InputGroupButton>{unit || "-"}</InputGroupButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {units.map((unit) => (
                    <DropdownMenuItem
                      key={unit}
                      onClick={() => handleSelect(unit)}
                    >
                      {unit}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </InputGroupAddon>
          </InputGroup>
        );
      }
      break;
    case "radio":
      {
        const radioProp = prop as PropertyRadio;
        inputToRender = (
          <RadioGroup value={value} onValueChange={onChange}>
            {radioProp.getOptions().map((option) => (
              <div
                key={radioProp.getOptionId(option)}
                className="flex items-center gap-3"
              >
                <RadioGroupItem
                  id={radioProp.getOptionId(option)}
                  value={radioProp.getOptionId(option)}
                />
                <Label htmlFor={radioProp.getOptionId(option)}>
                  {radioProp.getOptionLabel(option)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      }
      break;
    case "select":
      {
        const selectProp = prop as PropertySelect;
        inputToRender = (
          <Select
            value={value === "" ? undefined : value}
            onValueChange={(value) => {
              if (["", "null"].indexOf(value) > -1) {
                onChange(undefined);
              } else {
                onChange(value);
              }
            }}
          >
            <SelectTrigger size="sm" className="w-full">
              <SelectValue placeholder={valueWithDef} />
            </SelectTrigger>
            <SelectContent>
              {selectProp.getOptions().map((option) => {
                const value = selectProp.getOptionId(option);
                return (
                  <SelectItem key={value} value={value === "" ? "null" : value}>
                    {selectProp.getOptionLabel(option)}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );
      }
      break;
    case "color":
      {
        inputToRender = (
          <InputColor
            className="h-8"
            placeholder={defValue}
            value={valueString}
            onChange={onChange}
          />
        );
      }
      break;
    case "slider":
      {
        const sliderProp = prop as PropertySlider;
        inputToRender = (
          <Slider
            value={[parseFloat(value)]}
            min={sliderProp.getMin()}
            max={sliderProp.getMax()}
            step={sliderProp.getStep()}
            onValueChange={(v) => onChange(v[0])}
          />
        );
      }
      break;
    case "file":
      {
        inputToRender = (
          <div className="flex flex-col items-center gap-3">
            {value && value !== defValue && (
              <div
                className="w-[50px] h-[50px] rounded inline-block bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url("${value}")` }}
                onClick={() => handleChange("")}
              />
            )}
            <button type="button" onClick={openAssets}>
              Select Image
            </button>
          </div>
        );
      }
      break;
    case "composite":
      {
        const compositeProp = prop as PropertyComposite;
        inputToRender = (
          <div className="flex flex-wrap py-2 border rounded">
            {compositeProp.getProperties().map((prop) => (
              <StylePropertyField key={prop.getId()} prop={prop} />
            ))}
          </div>
        );
      }
      break;
    case "stack":
      {
        const stackProp = prop as PropertyStack;
        const layers = stackProp.getLayers();
        const isTextShadow = stackProp.getName() === "text-shadow";
        inputToRender = (
          <div className="flex flex-col gap-2 border rounded min-h-[54px]">
            {layers.map((layer, idx) => (
              <div key={layer.getId()}>
                <div className="flex gap-1 mx-2 pr-2 py-1 rounded-md items-center">
                  <div className="flex flex-col">
                    <Button
                      size={"icon-sm"}
                      variant={"ghost"}
                      className="h-4"
                      disabled={idx === 0}
                      onClick={() => layer.move(layer.getIndex() - 1)}
                    >
                      <ChevronUpIcon size={0.7} />
                    </Button>
                    <Button
                      size={"icon-sm"}
                      variant={"ghost"}
                      className="h-4"
                      disabled={layers.length === idx + 1}
                      onClick={() => layer.move(layer.getIndex() + 1)}
                    >
                      <ChevronDownIcon size={0.7} />
                    </Button>
                  </div>
                  <button className="flex-grow" onClick={() => layer.select()}>
                    {layer.getLabel()}
                  </button>
                  <div
                    className="bg-white min-w-[17px] min-h-[17px] text-black text-sm flex justify-center"
                    style={layer.getStylePreview({
                      number: { min: -3, max: 3 },
                      camelCase: true,
                    })}
                  >
                    {isTextShadow && "T"}
                  </div>
                  <Button
                    size={"icon-sm"}
                    variant={"ghost"}
                    onClick={() => layer.remove()}
                  >
                    <XIcon size={0.7} />
                  </Button>
                </div>
                <Separator />
                {layer.isSelected() && (
                  <div className="p-2 flex flex-wrap">
                    {stackProp.getProperties().map((prop) => (
                      <StylePropertyField key={prop.getId()} prop={prop} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }
      break;
  }

  return (
    <div
      {...rest}
      className={cn("mb-3 px-2", prop.isFull() ? "w-full" : "w-1/2")}
    >
      <div
        className={cn(
          "flex mb-2 items-center",
          canClear && "font-semibold italic"
        )}
      >
        <div className="flex items-center gap-1 flex-grow capitalize">
          {prop.getLabel()}
          {canClear && (
            <div className="cursor-pointer" onClick={() => prop.clear()}>
              <XIcon size={14} />
            </div>
          )}
        </div>
        {type === "stack" && (
          <Button
            className="!ml-2"
            variant={"ghost"}
            onClick={() => (prop as PropertyStack).addLayer({}, { at: 0 })}
          >
            <PlusIcon size={1} />
          </Button>
        )}
      </div>
      {inputToRender}
    </div>
  );
}
