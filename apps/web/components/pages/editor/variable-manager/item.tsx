import { FC } from "react";
import { VariableMeta, VariableState } from "../plugins/variable-manager/class";
import { useVariable } from "./provider";
import { Input } from "@repo/ui/components/ui/input";
import { Field, FieldLabel } from "@repo/ui/components/ui/field";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible";
import { AddButton } from "./add-button";
import { ChevronRightIcon, XIcon } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

type VariableItemProps = {
  path: string;
};

export const VariableItem: FC<VariableItemProps> = ({ path }) => {
  const { get, remove } = useVariable();
  const meta: VariableMeta | undefined = get(`${path}._meta`);
  const value: VariableState = get(`${path}`);
  if (!meta && typeof value === "string") return value;
  if (!meta) return null;
  const { type, label } = meta;

  const handleRemove = (path: string) => {
    remove(path);
  };

  switch (type) {
    case "input": {
      const v = get(`${path}.value`);
      return (
        <Field className={`group px-3 gap-0`}>
          <div className="flex">
            <FieldLabel className="grow" htmlFor={path}>
              {label}
            </FieldLabel>
            <Button
              variant={"ghost"}
              size={"icon-sm"}
              className="opacity-0 group-hover:opacity-100"
              onClick={() => handleRemove(path)}
            >
              <XIcon />
            </Button>
          </div>
          <Input id={path} defaultValue={v} />
        </Field>
      );
    }
    default: {
      return (
        <Collapsible>
          <CollapsibleTrigger
            className="w-full flex items-center h-11 text-left px-3
           border-y font-semibold text-sm"
          >
            {label}
            <div className="grow">
              <AddButton path={path} />
            </div>
            <ChevronRightIcon size={18} />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-3 py-3">
            {Object.keys(value).map((key) => {
              if (key === "_meta") {
                return null;
              }
              return <VariableItem key={key} path={`${path}.${key}`} />;
            })}
          </CollapsibleContent>
        </Collapsible>
      );
    }
  }
};
