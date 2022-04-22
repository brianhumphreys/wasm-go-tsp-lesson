import { Dispatch, MutableRefObject, SetStateAction, useCallback } from "react";
import { Pos } from "../types";
import { clearCanvas, drawPoint, findPos } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";

const useMakeRandomCanvas = (
  canvasRef: MutableRefObject<MyCanvas | null>,
  setPoints: Dispatch<SetStateAction<Pos[]>>
): VoidFunction => {
  return useCallback(() => {
    const myCanvas = canvasRef.current;
    if (myCanvas == null) {
      return;
    }
    const canvas = myCanvas.canvas;
    const context = myCanvas.context;

    const point = findPos(canvas);
    if (!point) {
      return;
    }
    clearCanvas(context, canvas.width, canvas.height);

    const points: Pos[] = [];

    for (let i = 0; i < 400; i++) {
      const x = Math.floor(Math.random() * canvas.width);
      const y = Math.floor(Math.random() * canvas.width);
      points.push({ x, y });
    }

    setPoints(points);
  }, [canvasRef, setPoints]);
};

export default useMakeRandomCanvas;
