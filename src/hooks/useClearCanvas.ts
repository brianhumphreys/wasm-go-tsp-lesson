import { MutableRefObject, useCallback } from "react";
import { clearCanvas } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";
import usePoints from "./usePoints";

const useClearCanvas = (
  canvasRefs: MutableRefObject<MyCanvas | null>[]
): Function => {
  const { clearPointsSingular } = usePoints();

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

      clearPointsSingular(myCanvas.algorithmName);
    });
  }, [...canvasRefs]);
};

export default useClearCanvas;
