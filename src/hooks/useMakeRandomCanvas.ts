import { Dispatch, SetStateAction, useCallback } from "react";
import { Pos } from "../types";
import { clearCanvas, drawPoint, findPos } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";

// change input type
const useMakeRandomCanvas = (
  myCanvas: MyCanvas | null,
  setPoints: Dispatch<SetStateAction<Pos[]>>
): VoidFunction => {
  return useCallback(() => {
    // if null provide default callback
    if (myCanvas == null) {
      return;
    }
    // no more null checking context
    // if (canvasRef == null || !canvasRef.current) {
    //   return;
    // }
    const canvas = myCanvas.canvas;
    const context = myCanvas.context;

    const point = findPos(canvas);
    if (!point) {
      return;
    }
    clearCanvas(context, canvas.width, canvas.height);

    const points: Pos[] = [];
    for (let i = 0; i < 100; i++) {
      const x = Math.floor(Math.random() * canvas.width);
      const y = Math.floor(Math.random() * canvas.width);
      drawPoint(context, x, y);
      points.push({ x, y });
    }

    setPoints(points);
  }, [myCanvas?.canvas, myCanvas?.context, setPoints]);
};

export default useMakeRandomCanvas;
