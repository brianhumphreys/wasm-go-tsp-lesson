import { Dispatch, MutableRefObject, SetStateAction, useCallback } from "react";
import { Pos } from "../types";
import { clearCanvas, drawPoint, findPos } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";
import usePoints from "./usePoints";

const useMakeRandomCanvas = (
  canvasRefs: MutableRefObject<MyCanvas | null>[]
): VoidFunction => {

  const {setPoints} = usePoints();
  // todo: get set all canvases from state

  return useCallback(() => {
    canvasRefs.forEach((canvasRef) => {
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
    })
    
  }, [...canvasRefs]);
};

export default useMakeRandomCanvas;
