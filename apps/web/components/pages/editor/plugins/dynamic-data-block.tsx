import { Plugin } from "grapesjs";

type DynamicDataBlockOptions = {
  category?: string;
};

export const GjsPluginDynamicDataBlock: Plugin<DynamicDataBlockOptions> = (
  editor,
  config
) => {
  const { category = "Seragam" } = config;
  const bm = editor.BlockManager;
  const Components = editor.Components;
  const defaultType = Components.getType("default");
  const defaultModel = defaultType?.model;
  const defaultView = defaultType?.view;

  Components.addType("variable", {
    isComponent: (el) => false,
    model: {
      defaults: {
        name: "Var",
        dropable: false,
        editable: false,
        traits: [
          {
            name: "Compile",
            type: "checkbox",
            category: "Settings",
          },
        ],
        template: `<div>{{your_variable}}</div>`,
      },
      init() {
        const isCompiled = this.em.Commands.isActive(
          "core:data-source:compile"
        );
        const component = this.components();
        component.on("all", (eventName, props) => {
          if (eventName === "component:update") {
            const htmlString = this.toHTML();
            this.set("template", htmlString);
            console.log("component update", props, htmlString);
          }
        });
        this.em.on("command:run command:stop", (props) => {
          if (props.id === "core:data-source:compile") {
            console.log("COMMAND RUN", props);
          }
        });
      },

      toHTML(opts) {
        console.log("TO HTML");
        if (this.components().length) {
          return defaultModel.prototype.toHTML.apply(this, arguments);
        } else {
          return this.get("template");
        }
      },
    },
    view: {
      ...defaultView,
      onRender({ el, model }) {
        const components = model.components();
        // if(model.components().length)
        console.log("onRender el", el);
        console.log("onRender components", components);
      },
    },
  });

  bm.add("srg-variable", {
    category,
    label: "Variable Test",
    media: `<svg viewBox="0 0 23 24"><path fill="currentColor" d="M2 20h4V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM17 20h4V4h-4v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1ZM9.5 20h4V4h-4v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z"/></svg>`,
    content: {
      type: "variable",
      components: `<div>Testing {{my_variable}}</div><span>{{other_var}}</span>`,
    },
  });
};
