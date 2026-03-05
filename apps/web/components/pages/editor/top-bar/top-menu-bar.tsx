import { useEditor } from "@grapesjs/react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@repo/ui/components/ui/menubar";
import { useEffect, useState } from "react";

type TopBarOptionTypes = {
  name: string;
  contents: {
    id?: string;
    type?: "separator";
    name?: string;
    hotkey?: string;
    disabled?: () => boolean;
    onClick?: () => void;
  }[];
};

export const TopMenuBar = () => {
  const editor = useEditor();
  const [, setUpdateCounter] = useState(0);
  const handleNewPage = () => {
    const PageManager = editor.Pages;
    const newPage = PageManager.add({
      name: `New page`,
      component: `<h1>Page content</h1>`,
    });
    if (newPage) PageManager.select(newPage);
  };
  const handleRunCommand = (id: string) => {
    editor.Commands.run(id);
  };
  const topbar_options: TopBarOptionTypes[] = [
    {
      name: "File",
      contents: [
        {
          name: "New Page",
          onClick: handleNewPage,
        },
        { type: "separator" },
        {
          id: "core:save-project",
          name: "Save",
        },
        {
          id: "core:save-project-as-html",
          name: "Save as HTML",
        },
        { type: "separator" },
        {
          id: "core:exit-project",
          name: "Exit",
        },
      ],
    },
    {
      name: "Edit",
      contents: [
        {
          id: "core:undo",
          name: "Undo",
          hotkey: "Ctrl+Z",
          disabled: () => !editor.UndoManager.hasUndo(),
        },
        {
          id: "core:redo",
          name: "Redo",
          hotkey: "Ctrl+Shift+Z",
          disabled: () => !editor.UndoManager.hasRedo(),
        },
        { type: "separator" },
      ],
    },
    {
      name: "Select",
      contents: [],
    },
  ];

  useEffect(() => {
    const cmdEvent = "command:run command:stop";
    const updateEvent = "update";
    const commands: string[] = topbar_options.reduce((prev, curr) => {
      const a: any = curr.contents
        .filter(({ id }) => id !== undefined)
        .map(({ id }) => id);
      return [...prev, ...a];
    }, [] as string[]);
    const updateCounter = () => {
      setUpdateCounter((value) => value + 1);
    };
    const onCommand = ({ id }: any) => {
      commands.indexOf(id) > -1 && updateCounter();
    };
    editor.on(cmdEvent, onCommand);
    editor.on(updateEvent, updateCounter);

    return () => {
      editor.off(cmdEvent, onCommand);
      editor.off(updateEvent, updateCounter);
    };
  }, [topbar_options, editor, setUpdateCounter]);

  return (
    <Menubar className="border-none shadow-none">
      {topbar_options.map((item) => (
        <MenubarMenu key={item.name}>
          <MenubarTrigger>{item.name}</MenubarTrigger>
          <MenubarContent>
            {item.contents.map((i, idx) => {
              if (i.type === "separator") return <MenubarSeparator key={idx} />;
              return (
                <MenubarItem
                  key={idx}
                  onClick={() => {
                    i.onClick?.();
                    if (i.id) {
                      handleRunCommand(i.id);
                    }
                  }}
                  disabled={i.disabled?.()}
                >
                  {i.name}
                  {i.hotkey && <MenubarShortcut>{i.hotkey}</MenubarShortcut>}
                </MenubarItem>
              );
            })}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  );
};
