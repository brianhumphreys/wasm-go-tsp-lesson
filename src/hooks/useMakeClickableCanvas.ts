import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Pos } from "../types";
import { drawPoint, findPos } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";

// Change the input type
const useMakeClickableCanvas = (
  myCanvas: MyCanvas | null,
  points: Pos[],
  setPoints: Dispatch<SetStateAction<Pos[]>>
) => {
  useEffect(() => {
    // now we can get rid of the check for ` || !canvasRef.current`
    // this is the only null check we need to do now and once doing
    // it, typescript allows us to freely use both the canvas element
    // and the context object without worry of null pointer exceptions.
    if (myCanvas == null) {
      return;
    }
    myCanvas.canvas.onclick = (e: MouseEvent) => {
      const point = findPos(myCanvas.canvas);
      if (!point) {
        return;
      }
      // and we can get rid of the null check for the context
      //   const context = canvas.getContext("2d");
      //   if (context == null) {
      //     return;
      //   }

      const x = e.pageX - point.x;
      const y = e.pageY - point.y;

      drawPoint(myCanvas.context, x, y);
      setPoints([...points, { x, y }]);
    };
    // add context and canvas to dependency array
  }, [myCanvas?.canvas, myCanvas?.context, points]);
};

export default useMakeClickableCanvas;
