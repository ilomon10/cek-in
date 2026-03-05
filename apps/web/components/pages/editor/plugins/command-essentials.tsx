import { CommandObject, Plugin } from "grapesjs";

export type CommandEssentialType = {
  command: string;
  handler: CommandObject;
};

type CommandEssentialsOptions = {
  commands: CommandEssentialType[];
};

export const GjsPluginCommandEssentials: Plugin<CommandEssentialsOptions> = (
  editor,
  config
) => {
  const commands = editor.Commands;
  // const dsm = editor.DataSources;
  commands.add("core:designer-mode", {
    run: (editor) => {
      editor.setDragMode("absolute");
    },
    stop: (editor) => {
      editor.setDragMode("");
    },
  });

  commands.add("core:data-source:compile", {
    run: () => {
      console.log("data-source:compile");
    },
    stop: () => {
      console.log("data-source:decompile");
    },
    abort: () => {
      console.log("data-source:abort");
    },
  });

  for (let cmd of config.commands) {
    commands.add(cmd.command, cmd.handler);
  }
};
