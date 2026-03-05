import { FC, KeyboardEvent, useEffect, useState } from "react";
import { Option } from "./types";
import {
  Tags,
  TagsContent,
  TagsInput as UiTagsInput,
  TagsTrigger,
  TagsValue,
  TagsEmpty,
  TagsGroup,
  TagsItem,
  TagsTriggerProps,
  TagsContentProps,
} from "@repo/ui/components/ui/tags";
import { Button } from "@repo/ui/components/ui/button";
import { CheckIcon, PlusIcon } from "lucide-react";

type TagsInputProps = {
  values: string[];
  options: Option[];
  onChange?: (value: string[]) => void;

  placeholder?: string;

  triggerProps?: TagsTriggerProps;
  contentProps?: TagsContentProps;
};

export const TagsInput: FC<TagsInputProps> = ({
  values = [],
  onChange,
  options,

  placeholder,

  triggerProps,
  contentProps,
}) => {
  const [localOptions, setLocalOptions] = useState<Option[]>(options);
  const [newTag, setNewTag] = useState("");
  const [localValues, setLocalValues] = useState<string[]>(values);

  const handleAdd = (value: string) => {
    if (values.indexOf(value) > -1) {
      handleRemove(value);
    } else {
      setLocalValues([...values, value]);
    }
  };

  const handleRemove = (value: string) => {
    setLocalValues([...values.filter((v) => v !== value)]);
  };
  const handleNewTag = () => {
    setLocalOptions((s) => {
      return [...s, { label: newTag, value: newTag }];
    });
    handleAdd(newTag);
    setNewTag("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && newTag !== "") {
      if (!localOptions.find(({ value }) => value === newTag)) handleNewTag();
    }
  };

  useEffect(() => {
    onChange?.(localValues);
  }, [localValues]);

  return (
    <Tags>
      <TagsTrigger {...triggerProps}>
        {(values as string[]).map((value, idx) => {
          const option = localOptions.find(({ value: v }) => v === value);
          return (
            <TagsValue
              key={`${idx}-${value}`}
              onRemove={() => handleRemove(value)}
            >
              {option?.label}
            </TagsValue>
          );
        })}
      </TagsTrigger>
      <TagsContent {...contentProps}>
        <UiTagsInput
          onValueChange={setNewTag}
          onKeyDown={handleKeyDown}
          value={newTag}
          placeholder={placeholder}
        />
        <TagsEmpty>
          {newTag ? (
            <Button variant={"ghost"} onClick={handleNewTag}>
              <PlusIcon />
              Create new tag {newTag}
            </Button>
          ) : (
            "Type something..."
          )}
        </TagsEmpty>
        <TagsGroup>
          {localOptions.map(({ label, value }) => (
            <TagsItem key={`${value}`} value={`${value}`} onSelect={handleAdd}>
              {label}
              {values.includes(`${value}`) && (
                <CheckIcon className="text-muted-foreground" size={14} />
              )}
            </TagsItem>
          ))}
        </TagsGroup>
      </TagsContent>
    </Tags>
  );
};
