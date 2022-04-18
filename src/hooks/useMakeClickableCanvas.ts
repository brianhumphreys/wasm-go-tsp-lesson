import { MutableRefObject, useEffect, useState } from "react";
import { Pos } from "../types";
import { drawPoint, findPos } from "../utilities/canvasUtils";

const useMakeClickableCanvas = (
  canvasRef: MutableRefObject<HTMLCanvasElement | null>
) => {
  const [points, setPoints] = useState<Pos[]>([]);

  useEffect(() => {
    if (canvasRef == null || !canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    canvas.onclick = (e: MouseEvent) => {
      // find position
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

      // then draw a point at that position
      drawPoint(context, x, y);

      // add new point to state
      setPoints([...points, {x, y}]);
      console.log(points);
    };
  }, [canvasRef]);
};

export default useMakeClickableCanvas;
