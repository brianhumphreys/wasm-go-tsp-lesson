import { Dispatch, MutableRefObject, SetStateAction, useCallback } from "react";
import { Pos } from "../types";
import { clearCanvas, drawPoint, findPos } from "../utilities/canvasUtils";

// we dont need to pass in `points`
const useMakeRandomCanvas = (
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  setPoints: Dispatch<SetStateAction<Pos[]>>
): VoidFunction => {
  // useCallback instead of useEffect.  We return void function that
  // will be our random-button click handler
  return useCallback(() => {
    if (canvasRef == null || !canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    // find position
    const point = findPos(canvas);
    if (!point) {
      return;
    }
    const context = canvas.getContext("2d");
    if (context == null) {
      return;
    }

    // clear Previous points
    clearCanvas(context,canvas.width, canvas.height);

    // get all points and set all at once
    const points: Pos[] = [];
    for (let i = 0; i < 100; i++) {
      const x = Math.floor(Math.random() * canvas.width);
      const y = Math.floor(Math.random() * canvas.width);
      // then draw a point at that position
      drawPoint(context, x, y);
      points.push({ x, y });
    }

    // add new point to state
    setPoints(points);
    // we have to add points to the dependency array otherwise the array will not update
  }, [canvasRef, setPoints]);
};

export default useMakeRandomCanvas;
