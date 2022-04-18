import { Dispatch, MutableRefObject, SetStateAction, useEffect, useState } from "react";
import { Pos } from "../types";
import { drawPoint, findPos } from "../utilities/canvasUtils";

const useMakeClickableCanvas = (
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  points: Pos[],
  setPoints: Dispatch<SetStateAction<Pos[]>>
) => {

  useEffect(() => {
    if (canvasRef == null || !canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    canvas.onclick = (e: MouseEvent) => {
      const point = findPos(canvas);
      if (!point) {
        return;
      }
      const context = canvas.getContext("2d");
      if (context == null) {
        return;
      }

      const x = e.pageX - point.x;
      const y = e.pageY - point.y;

      drawPoint(context, x, y);
      setPoints([...points, {x, y}]);
    };
  }, [canvasRef, points]);
};

export default useMakeClickableCanvas;
