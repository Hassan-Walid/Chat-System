import { useRef } from "react";

export function useRenderCount() {
  const renderCount = useRef(0);
  renderCount.current++;
  console.log(`Render count: ${renderCount.current}`);
}
