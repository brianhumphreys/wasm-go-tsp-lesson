import {
    Dispatch,
    MutableRefObject,
    SetStateAction,
    useEffect
} from "react";
import { Pos } from "../types";
import { drawPoint, findPos } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";

const useMakeClickableCanvas = (
  canvasRef: MutableRefObject<MyCanvas | null>,
  points: Pos[],
  setPoints: (points: Pos[]) => void,
) => {
  useEffect(() => {
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

      setPoints([...points, { x, y }]);
    };
  }, [canvasRef, points]);
};

export default useMakeClickableCanvas;
