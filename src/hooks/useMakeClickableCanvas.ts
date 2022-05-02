import { Dispatch, MutableRefObject, SetStateAction, useEffect } from "react";
import { Pos } from "../types";
import { drawPoint, findPos } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";
import usePoints from "./usePoints";

const useMakeClickableCanvas = (
  canvasRefs: MutableRefObject<MyCanvas | null>[]
) => {
  const { addPoint } = usePoints();
  useEffect(() => {
    canvasRefs.forEach((canvasRef) => {
      const myCanvas = canvasRef.current;
      if (myCanvas == null) {
        return;
      }
      myCanvas.canvas.onclick = (e: MouseEvent) => {
        const point = findPos(myCanvas.canvas);
        if (!point) {
          return;
        }

        const x = e.pageX - point.x;
        const y = e.pageY - point.y;

        addPoint({ x, y });
      };
    });
  }, [...canvasRefs]);
};

export default useMakeClickableCanvas;
