import { Dispatch, MutableRefObject, SetStateAction, useCallback } from "react";
import { useDispatch } from "react-redux";
import { clearCostItems } from "../store/costSlice";
import { Algorithms, Pos } from "../types";
import { clearCanvas } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";
import usePoints from "./usePoints";

const useClearCanvas = (
  canvasRefs: MutableRefObject<MyCanvas | null>[]
): Function => {
  const { clearPoints } = usePoints();

  return useCallback(() => {
    canvasRefs.forEach((canvasRef) => {
      const myCanvas = canvasRef.current;
      if (myCanvas == null) {
        return;
      }

      clearCanvas(
        myCanvas.context,
        myCanvas.canvas.width,
        myCanvas.canvas.height
      );

      clearPoints();
    });
  }, [...canvasRefs]);
};

export default useClearCanvas;
