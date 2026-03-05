"use client";

import {
  EditorConfig,
  grapesjs,
  ProjectData,
  usePlugin,
  type Editor as GEditor,
} from "grapesjs";
import GjsPluginBlockBasic from "grapesjs-blocks-basic";
import GJSEditor, { AssetsProvider } from "@grapesjs/react";
import { FC } from "react";
import Topbar from "./top-bar";
import RightSidebar from "./right-sidebar";
import AssetManager, { AssetManagerProps } from "./asset-manager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { GjsPluginBasicBlocks } from "./plugins/basic-blocks";
import LeftSidebar from "./side-bar/left-sidebar";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/ui/sidebar";
import { EditorSidebar } from "./side-bar/sidebar";
import { LeftSidebarContextProvider } from "./side-bar/left-sidebar-provider";
import {
  CommandEssentialType,
  GjsPluginCommandEssentials,
} from "./plugins/command-essentials";
import { GjsPluginSectionBlock } from "./plugins/section-block/plugin";
import GJSPluginVariableManager from "./plugins/variable-manager/plugin";
import { EditorCanvas } from "./editor-canvas";
import { GjsPluginCanvasFullSize } from "./plugins/canvas-full-size";
import "./editor.css";

type EditorProps = {
  initialData?: ProjectData;
  onSave?: (data: ProjectData, editor: GEditor) => void;
  onSaveAsHTML?: (data: { html: string; css?: string }) => void;
  onExit?: (editor: GEditor) => void;
  assetManager?: Pick<AssetManagerProps, "onLoaded" | "onUpload" | "onRemove">;
  options?: EditorConfig;
};

const DEFAULT_OPTIONS: EditorConfig = {
  storageManager: false,
  selectorManager: { componentFirst: false },
  assetManager: {
    custom: {
      open: () => {},
      close: () => {},
    },
  },
  undoManager: {
    trackSelection: false,
  },
  parser: {
    optionsHtml: {
      allowScripts: true,
    },
  },
  canvas: {
    styles: ["/editor-style.css"],
    scripts: ["https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"],
  },
  deviceManager: {
    default: "mobile-small",
    devices: [
      {
        name: "Tablet",
        id: "tablet",
        width: "1024px", // iPad landscape width
        height: "1366px", // iPad Pro height
        widthMedia: "768px", // activates from tablet size
        priority: 3,
      },
      {
        name: "Mobile Medium",
        id: "mobile-medium",
        width: "750px", // iPhone 15/14/13/12 Pro width
        height: "1334px", // iPhone 8/SE2 height (approx mid-size)
        widthMedia: "600px",
        priority: 2,
      },
      {
        name: "Mobile Small",
        id: "mobile-small",
        width: "375px", // iPhone SE or small Android
        height: "667px", // Common small-screen height
        widthMedia: "599px",
        priority: 1,
      },
    ],
  },
};

export const Editor: FC<EditorProps> = ({
  initialData,
  onSave,
  onSaveAsHTML,
  onExit,
  options,
  assetManager,
}) => {
  const defaultData = initialData || {
    pages: [
      {
        name: "Home page",
        component: `<section class="p-2"><h1>Start to styling, double click me to edit</h1></section>`,
      },
    ],
  };

  const commands: CommandEssentialType[] = [
    {
      command: "core:save-project",
      handler: {
        run: (editor) => {
          console.log("Save", editor.getProjectData());
          if (onSave) onSave(editor.getProjectData(), editor);
        },
      },
    },
    {
      command: "core:exit-project",
      handler: {
        run: (editor) => {
          if (onExit) onExit(editor);
        },
      },
    },
    {
      command: "core:save-project-as-html",
      handler: {
        run: (editor) => {
          if (onSaveAsHTML)
            onSaveAsHTML({ html: editor.getHtml(), css: editor.getCss() });
        },
      },
    },
  ];

  const handleEditor = (editor: GEditor) => {
    console.log(editor.getConfig());
  };

  return (
    <GJSEditor
      grapesjs={grapesjs}
      grapesjsCss="/grapes.min.css"
      options={{
        ...DEFAULT_OPTIONS,
        ...options,
        projectData: defaultData,
      }}
      plugins={[
        usePlugin(GjsPluginCanvasFullSize, {}),
        usePlugin(GjsPluginBlockBasic, {}),
        usePlugin(GjsPluginBasicBlocks, {}),
        // usePlugin(GjsPluginDynamicDataBlock, {}),
        usePlugin(GjsPluginCommandEssentials, {
          commands: commands,
        }),
        usePlugin(GjsPluginSectionBlock, {}),
        usePlugin(GJSPluginVariableManager, {}),
      ]}
      onEditor={handleEditor}
    >
      <SidebarProvider open={false}>
        <LeftSidebarContextProvider defaultValue="section">
          <EditorSidebar />
          <SidebarInset>
            <div className="flex h-full">
              <LeftSidebar
                className={
                  "gjs-column-r w-[300px] border-r data-[selected=false]:border-0"
                }
              />

              <div className="gjs-column-m flex flex-col flex-grow w-[1px]">
                <Topbar className="border-b" />
                <EditorCanvas />
              </div>

              <RightSidebar className={"gjs-column-r w-[300px] border-l"} />
            </div>
          </SidebarInset>
        </LeftSidebarContextProvider>
      </SidebarProvider>

      <AssetsProvider>
        {({ assets, select, close, open }) => (
          <Dialog
            open={open}
            onOpenChange={(open) => {
              !open && close();
            }}
          >
            <DialogContent
              className="w-full flex flex-col"
              style={{
                maxWidth: "768px",
                height: "95vh",
              }}
            >
              <DialogHeader>
                <DialogTitle>Select image</DialogTitle>
              </DialogHeader>
              <AssetManager
                {...assetManager}
                assets={assets}
                select={select}
                close={close}
              />
            </DialogContent>
          </Dialog>
        )}
      </AssetsProvider>
    </GJSEditor>
  );
};
