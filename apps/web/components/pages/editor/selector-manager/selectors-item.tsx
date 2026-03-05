import { Button } from "@repo/ui/components/ui/button";
import { ButtonGroup } from "@repo/ui/components/ui/button-group";
import { Selector } from "grapesjs";
import { XIcon } from "lucide-react";
import { ChangeEvent, FC, KeyboardEvent, useState } from "react";
import { useDisclosure } from "../../../hooks/use-disclosure";
import { Input } from "@repo/ui/components/ui/input";
import { SelectorsResultProps, useEditor } from "@grapesjs/react";

type SelectorItemProps = {
  selector: Selector;
  onAdd: SelectorsResultProps["addSelector"];
  onRemove: (selector: Selector) => void;
};

export const SelectorItem: FC<SelectorItemProps> = ({
  selector,
  onAdd,
  onRemove,
}) => {
  const editor = useEditor();
  const [label, setLabel] = useState(selector.getLabel());
  const [isEdit, { open, close }] = useDisclosure(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };
  const handleSubmit = () => {
    const selectorManager = editor.SelectorManager;
    const s = selectorManager.get(selector.id as string) as Selector;
    onRemove(s);
    onAdd(label);
    close();
  };
  const handleBlur = () => {
    handleSubmit();
  };
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      handleSubmit();
    }
  };
  return (
    <ButtonGroup>
      {isEdit ? (
        <Input
          className={"h-8"}
          defaultValue={selector.getLabel()}
          onChange={handleChange}
          autoFocus={true}
          onBlur={handleBlur}
          onKeyUp={handleKey}
        />
      ) : (
        <Button size={"sm"} variant={"outline"} onClick={() => open()}>
          {selector.getLabel()}
        </Button>
      )}
      <Button
        type="button"
        size={"icon-sm"}
        variant={"outline"}
        onClick={() => onRemove(selector)}
      >
        <XIcon size={0.7} />
      </Button>
    </ButtonGroup>
  );
};
