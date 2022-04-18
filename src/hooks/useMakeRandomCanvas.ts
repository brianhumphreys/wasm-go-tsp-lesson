import { Dispatch, MutableRefObject, SetStateAction, useCallback } from "react";
import { Pos } from "../types";
import { clearCanvas, drawPoint, findPos } from "../utilities/canvasUtils";

const useMakeRandomCanvas = (
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  setPoints: Dispatch<SetStateAction<Pos[]>>
): VoidFunction => {
  return useCallback(() => {
    if (canvasRef == null || !canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const point = findPos(canvas);
    if (!point) {
      return;
    }
    const context = canvas.getContext("2d");
    if (context == null) {
      return;
    }

    clearCanvas(context,canvas.width, canvas.height);

    const points: Pos[] = [];
    for (let i = 0; i < 100; i++) {
      const x = Math.floor(Math.random() * canvas.width);
      const y = Math.floor(Math.random() * canvas.width);
      drawPoint(context, x, y);
      points.push({ x, y });
    }

    setPoints(points);
  }, [canvasRef, setPoints]);
};

export default useMakeRandomCanvas;
