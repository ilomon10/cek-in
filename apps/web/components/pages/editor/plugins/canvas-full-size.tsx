import { Plugin } from "grapesjs";

type CanvasFullSizeOptions = {};

let timer: any;

function debounce(cb: () => void) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    cb();
  }, 200);
}

export const GjsPluginCanvasFullSize: Plugin<CanvasFullSizeOptions> = (
  editor,
  config
) => {
  const Canvas = editor.Canvas;
  const Commands = editor.Commands;
  let isFitted = false;
  Commands.add("core:fit-viewport", {
    run() {
      Canvas.fitViewport({
        frame: editor.Canvas.getFrame(),
      });
      isFitted = true;
    },
    stop() {
      Canvas.fitViewport({
        frame: editor.Canvas.getFrame(),
        zoom() {
          return 100;
        },
      });
      isFitted = false;
    },
  });

  editor.onReady(() => {
    Commands.run("core:fit-viewport");
    const canvasEl = Canvas.getElement();
    const observer = new ResizeObserver((entries) => {
      debounce(() => {
        if (!isFitted) return;
        Canvas.fitViewport();
      });
    });

    observer.observe(canvasEl);
  });

  editor.on("device:select", () => {
    debounce(() => {
      if (!isFitted) return;
      Canvas.fitViewport();
    });
  });
};
