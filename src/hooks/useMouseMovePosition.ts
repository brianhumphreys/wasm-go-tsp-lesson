import {
    MutableRefObject, useEffect
} from "react";
import { Pos } from "../types";
import { findPos } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";

const useMouseMovePosition = (
  canvasRef: MutableRefObject<MyCanvas | null>,
  posPrintRef: MutableRefObject<HTMLSpanElement | null>,
) => {
  useEffect(() => {
    const myCanvas = canvasRef.current;
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
  }, [canvasRef]);
};

export default useMouseMovePosition;
