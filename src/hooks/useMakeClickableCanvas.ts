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
  setPoints: Dispatch<SetStateAction<Pos[]>>
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

      // we want to keep drawing all in the same component
      // we will keep this hook for managing state of 
      // selected points and contain drawing in a single 
      // hook
      // drawPoint(myCanvas.context, x, y);
      setPoints([...points, { x, y }]);
    };
  }, [canvasRef, points]);
};

export default useMakeClickableCanvas;
