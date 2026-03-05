import { Component, Plugin } from "grapesjs";
import { toLowerCase } from "../utils/to-lowercase";
import { SectionManager } from "./class";
declare module "grapesjs" {
  interface Editor {
    SectionManager: SectionManager;
  }
}

type SectionBlockOptions = {
  category?: string;
  editable?: boolean;
};

export const GjsPluginSectionBlock: Plugin<SectionBlockOptions> = (
  editor,
  { category = "Basic", editable = true }
) => {
  const bm = editor.BlockManager;
  const Components = editor.Components;
  const defaultType = Components.getType("default");
  // const defaultModel = defaultType?.model;
  const defaultView = defaultType?.view;

  // create manager and attach to editor for easy access
  const manager = new SectionManager(editor);
  // Attach to editor instance
  editor.SectionManager = manager;

  Components.addType("wrapper", {
    model: {
      defaults: {
        droppable: "section",
      },
    },
  });
  Components.addType("section", {
    isComponent: (el) => {
      if (toLowerCase(el.tagName) !== "section") return false;
      return {
        type: "section",
      };
    },
    model: {
      defaults: {
        name: "Section",
        tagName: "section",
        droppable(source: Component) {
          if (source.getType() !== "section") {
            return true;
          }
          return false;
        },
        draggable(_source: Component, target: Component) {
          if (target.getType() === "wrapper") {
            return true;
          }
          return false;
        },
        editable: true,
        attributes: {
          class: [".srg-section"],
        },
        traits: [
          {
            id: "name",
            label: "Name",
            category: "Configure",
          },
        ],
      },
      init() {
        const components = this.components().toArray();
        // const Commands = this.em.Commands;
        // const bb = Commands.isActive("");
        for (let component of components) {
          component.set({
            draggable: editable,
            droppable: editable,
          });
        }
      },
    },
    view: defaultView,
  });

  bm.add("srg-section", {
    category,
    label: "Section",
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M2 20h20V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Z"/></svg>`,
    content: `<section class="p-2">
      <div 
        data-gjs-name="Container"
        data-gjs-type="default"
      ></div>
    </section>`,
  });
};
