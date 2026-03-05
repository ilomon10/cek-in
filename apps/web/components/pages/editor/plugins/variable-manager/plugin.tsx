"use client";
declare module "grapesjs" {
  interface Editor {
    VariableManager: VariableManager;
  }
}

import { Editor } from "grapesjs";
import { VariableState, VariableManager } from "./class";

export type VariableManagerOptions = {
  initial?: VariableState; // initial variable list
};

export default function GJSPluginVariableManager(
  editor: Editor,
  opts: Partial<VariableManagerOptions> = {}
) {
  const options: VariableManagerOptions = {
    initial: {
      _meta: { type: "root" },
      globalData: {
        _meta: { type: "group" },
        default_color: {
          _meta: {
            type: "input",
            label: "Default Color",
          },
          value: "red",
        },
      },
    },
    ...opts,
  };

  // create manager and attach to editor for easy access
  const manager = new VariableManager(editor, options.initial);
  // Attach to editor instance
  editor.VariableManager = manager;
}
