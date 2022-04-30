import {
    MutableRefObject, useEffect
} from "react";
import { Pos } from "../types";
import { findPos } from "../utilities/canvasUtils";
import { MyCanvas, UseCanvas } from "./useCanvas";

const useMouseMovePosition = (
  canvases: UseCanvas[],
  posPrintRef: MutableRefObject<HTMLSpanElement | null>,
) => {
  useEffect(() => {
    canvases.forEach((canvasRef) => {
      const myCanvas = canvasRef.myCanvasRef.current;
      const outputDiv = posPrintRef.current;
      if (myCanvas == null) {
        return;
      }
      myCanvas.canvas.onmousemove = (e: MouseEvent) => {
        const point = findPos(myCanvas.canvas);
        if (!point) {
          return;
        }
  
        const x = e.pageX - point.x;
        const y = e.pageY - point.y;
  
        if (!!outputDiv) {
          outputDiv.textContent = `${x},${y}`;
        }
      };
    })
    
  }, [...canvases]);
};

export default useMouseMovePosition;
