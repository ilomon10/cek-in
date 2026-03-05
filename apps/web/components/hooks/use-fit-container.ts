import { useEffect, useState } from "react";
import { useElementSize } from "./use-resize-observer";

const useFitToContainer = () => {
  const {
    ref: containerRef,
    width: containerW,
    height: containerH,
  } = useElementSize();
  const {
    ref: contentRef,
    width: contentW,
    height: contentH,
  } = useElementSize();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const contentWidth = content.offsetWidth;
    const contentHeight = content.offsetHeight;

    // Calculate scale based on the smaller dimension to ensure it fits
    const widthScale = containerWidth / contentWidth;
    const heightScale = containerHeight / contentHeight;
    const newScale = Math.min(widthScale, heightScale);

    setScale(newScale);
  }, [
    [containerW, containerH],
    [contentW, contentH],
  ]);

  return { containerRef, contentRef, scale };
};

export default useFitToContainer;
