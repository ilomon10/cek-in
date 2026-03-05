import { Plugin } from "grapesjs";
import { attrsToString } from "./utils/attrs-to-string";

type BasicBlocksOptions = {
  category?: string;
};

export const GjsPluginBasicBlocks: Plugin<BasicBlocksOptions> = (
  editor,
  config
) => {
  const { category = "Seragam" } = config;
  const bm = editor.BlockManager;
  // const Components = editor.Components;

  const step = 0.2;
  const minDim = 1;
  const currentUnit = 1;
  const resizerBtm: Record<string, any> = {
    tl: 0,
    tc: 0,
    tr: 0,
    cl: 0,
    cr: 0,
    bl: 0,
    br: 0,
    minDim,
  };

  const resizerRight: Record<string, any> = {
    ...resizerBtm,
    cr: 1,
    bc: 0,
    currentUnit,
    minDim,
    step,
  };

  const clsRow = "srg-layout-row";
  const clsCell = "srg-layout-col";

  const rowAttr = {
    // class: clsRow,
    "data-gjs-droppable": `.${clsCell}`,
    "data-gjs-resizable": resizerBtm,
    "data-gjs-name": "Row",
    // "data-gjs-type": "row",
  };

  const colAttr: Record<string, any> = {
    // class: clsCell,
    "data-gjs-draggable": `.${clsRow}`,
    "data-gjs-resizable": resizerRight,
    "data-gjs-name": "Cell",
  };

  const rowAttrs = attrsToString(rowAttr);
  const colAttrs = attrsToString(colAttr);
  // const attrRow = "data-layout-row";
  // const labelRow = "Row";

  bm.add("srg-grid-1", {
    category,
    label: "1 Grid",
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M2 20h20V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Z"/></svg>`,
    content: `
      <div ${rowAttrs} class="${clsRow} grid grid-cols-1 gap-2 p-2">
        <div ${colAttrs} class="${clsCell} h-20"></div>
      </div>
    `,
  });
  bm.add("srg-grid-2", {
    category,
    label: "2 Grid",
    media: `<svg viewBox="0 0 23 24"><path fill="currentColor" d="M2 20h8V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM13 20h8V4h-8v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1Z"/></svg>`,
    content: `
      <div ${rowAttrs} class="${clsRow} grid grid-cols-2 gap-2 p-2">
        <div ${colAttrs} class="${clsCell} h-20"></div>
        <div ${colAttrs} class="${clsCell} h-20"></div>
      </div>
    `,
  });
  bm.add("srg-grid-3", {
    category,
    label: "3 Grid",
    media: `<svg viewBox="0 0 23 24"><path fill="currentColor" d="M2 20h4V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM17 20h4V4h-4v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1ZM9.5 20h4V4h-4v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z"/></svg>`,
    content: `
      <div ${rowAttrs} class="${clsRow} grid grid-cols-3 gap-2 p-2">
        <div ${colAttrs} class="${clsCell} h-20"></div>
        <div ${colAttrs} class="${clsCell} h-20"></div>
        <div ${colAttrs} class="${clsCell} h-20"></div>
      </div>
    `,
  });

  bm.add("src-header-1", {
    category: "Header",
    label: "Header 1",
    media: `<svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M22 9c0-.6-.5-1-1.25-1H3.25C2.5 8 2 8.4 2 9v6c0 .6.5 1 1.25 1h17.5c.75 0 1.25-.4 1.25-1V9Zm-1 6H3V9h18v6Z"></path>
        <path fill="currentColor" d="M15 10h5v1h-5zM15 13h5v1h-5zM15 11.5h5v1h-5z"></path>
      </svg>`,
    content: `
    <header class="text-gray-600 body-font">
      <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span class="ml-3 text-xl">Tailblocks</span>
        </a>
        <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <a class="mr-5 hover:text-gray-900">First Link</a>
          <a class="mr-5 hover:text-gray-900">Second Link</a>
          <a class="mr-5 hover:text-gray-900">Third Link</a>
          <a class="mr-5 hover:text-gray-900">Fourth Link</a>
        </nav>
        <button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Button
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </header>
    `,
  });
  bm.add("src-header-2", {
    category: "Header",
    label: "Header 2",
    media: `<svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M22 9c0-.6-.5-1-1.25-1H3.25C2.5 8 2 8.4 2 9v6c0 .6.5 1 1.25 1h17.5c.75 0 1.25-.4 1.25-1V9Zm-1 6H3V9h18v6Z"></path>
        <path  fill="currentColor" d="M15 10h5v1h-5zM15 13h5v1h-5zM15 11.5h5v1h-5z"></path>
      </svg>`,
    content: `
    <header class="text-gray-600 body-font">
      <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span class="ml-3 text-xl">Tailblocks</span>
        </a>
        <nav class="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <a class="mr-5 hover:text-gray-900">First Link</a>
          <a class="mr-5 hover:text-gray-900">Second Link</a>
          <a class="mr-5 hover:text-gray-900">Third Link</a>
          <a class="mr-5 hover:text-gray-900">Fourth Link</a>
        </nav>
        <button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Button
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </header>
    `,
  });
};
