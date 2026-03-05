import { generateId } from "@repo/ui/lib/generate-id";
import html2canvas from "html2canvas-pro";

export async function htmlToImageFile(
  dom: HTMLElement,
  options?: {
    filename: string;
    mime: string;
  }
): Promise<File> {
  const { filename = `${generateId()}.png`, mime = "image/png" } =
    options || {};
  const canvas = await html2canvas(dom, { useCORS: true });
  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), mime)
  );
  return new File([blob], filename, {
    type: mime,
  });
}
