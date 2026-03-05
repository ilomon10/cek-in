import { Canvas } from "@grapesjs/react";

export const EditorCanvas = () => {
  return (
    <div className=" p-4 w-full h-[1px] grow bg-muted dark:bg-muted-foreground">
      <Canvas />
    </div>
  );
};
