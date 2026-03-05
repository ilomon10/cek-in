import { SaveIcon, CodeXmlIcon, CloudCheckIcon } from "lucide-react";
import React from "react";
import TopbarButtons, { CommandButton } from "./top-bar-buttons";

export const TopBarRightButtons = (
  props: React.HTMLAttributes<HTMLDivElement>
) => {
  const cmdButtons: CommandButton[] = React.useMemo(
    () => [
      { id: "core:open-code", label: "Export Code", icon: CodeXmlIcon },
      {
        id: "core:save-project",
        label: "Save Project",
        icon: SaveIcon,
      },
      {
        id: "core:publish-project",
        label: "Publish",
        icon: CloudCheckIcon,
      },
    ],
    []
  );
  return <TopbarButtons {...props} cmdButtons={cmdButtons} />;
};
