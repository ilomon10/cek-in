import { FC } from "react";
import { useVariable, VariableProvider } from "./provider";
import { useEditorMaybe, WithEditor } from "@grapesjs/react";
import { VariableState } from "../plugins/variable-manager/class";
import { VariableItem } from "./item";
import { AddButton } from "./add-button";

const VariableWrapper: FC = () => {
  const { get } = useVariable();
  const globalState = get("globalData") as VariableState;
  const handleAddVariable = () => {};

  return (
    <div className="flex flex-col gap-3">
      <h2 className="h-11 border-b text-sm flex items-center px-2">
        Global Data
        <AddButton path="globalData" onSubmit={handleAddVariable} />
      </h2>
      {Object.keys(globalState).map((key) => {
        if (key === "_meta") {
          return null;
        }
        return <VariableItem key={key} path={`globalData.${key}`} />;
      })}
    </div>
  );
};

export const VariableManager: FC = () => {
  return (
    <WithEditor>
      <VariableProvider>
        <VariableWrapper />
      </VariableProvider>
    </WithEditor>
  );
};
