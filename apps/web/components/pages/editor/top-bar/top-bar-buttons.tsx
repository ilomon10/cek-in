import * as React from "react";
import { useEditor } from "@grapesjs/react";
import { useEffect, useState } from "react";
import { cn } from "@repo/ui/lib/utils";
import { TopBarButton } from "./top-bar-button";

export interface CommandButton {
  id: string;
  icon: React.ElementType;
  label: string;
  options?: Record<string, any>;
  disabled?: () => boolean;
}

export default function TopbarButtons({
  className,
  cmdButtons,
}: React.HTMLAttributes<HTMLDivElement> & {
  cmdButtons: CommandButton[];
}) {
  const editor = useEditor();
  const [, setUpdateCounter] = useState(0);
  const { Commands } = editor;

  useEffect(() => {
    const cmdEvent = "command:run command:stop";
    const updateEvent = "update";
    const updateCounter = () => {
      setUpdateCounter((value) => value + 1);
    };
    const onCommand = ({ id }: any) => {
      cmdButtons.find((btn) => btn.id === id) && updateCounter();
    };
    editor.on(cmdEvent, onCommand);
    editor.on(updateEvent, updateCounter);

    return () => {
      editor.off(cmdEvent, onCommand);
      editor.off(updateEvent, updateCounter);
    };
  }, [cmdButtons, editor, setUpdateCounter]);

  return (
    <div className={cn("flex gap-1", className)}>
      {cmdButtons.map(({ id, icon: Icon, disabled, label, options = {} }) => (
        <TopBarButton
          key={id}
          label={label}
          buttonProps={{
            type: "button",
            size: "icon",
            variant: Commands.isActive(id) ? "default" : "outline",
            className: cn(disabled?.() && "opacity-50"),
            onClick: () => {
              Commands.isActive(id)
                ? Commands.stop(id)
                : Commands.run(id, options);
            },
            disabled: disabled?.(),
          }}
        >
          <Icon size={1} />
        </TopBarButton>
      ))}
    </div>
  );
}
