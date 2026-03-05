import {
  UndoIcon,
  RedoIcon,
  FullscreenIcon,
  SquareRoundCornerIcon,
} from "lucide-react";
import React from "react";
import TopbarButtons, { CommandButton } from "./top-bar-buttons";
import { useEditor } from "@grapesjs/react";

export const TopBarLeftButtons = (
  props: React.HTMLAttributes<HTMLDivElement>
) => {
  const editor = useEditor();
  const { UndoManager } = editor;

  const cmdButtons: CommandButton[] = React.useMemo(
    () => [
      {
        id: "core:undo",
        label: "Undo",
        icon: UndoIcon,
        disabled: () => !UndoManager.hasUndo(),
      },
      {
        id: "core:redo",
        label: "Redo",
        icon: RedoIcon,
        disabled: () => !UndoManager.hasRedo(),
      },
      {
        id: "core:fit-viewport",
        label: "Fit Viewport",
        icon: FullscreenIcon,
      },
      {
        id: "core:component-outline",
        label: "Show Outline",
        icon: SquareRoundCornerIcon,
      },
    ],
    [UndoManager]
  );
  return <TopbarButtons {...props} cmdButtons={cmdButtons} />;
};
