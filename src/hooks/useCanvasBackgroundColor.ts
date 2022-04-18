import { MutableRefObject, useEffect } from "react";
import { clearCanvas } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";

const useCanvasBackgroudColor = (
  canvasRef: MutableRefObject<MyCanvas | null>
) => {
  useEffect(() => {
    const myCanvas = canvasRef.current;
    if (myCanvas == null) {
      return;
    }

    clearCanvas(
      myCanvas.context,
      myCanvas.canvas.width,
      myCanvas.canvas.height
    );
  }, [canvasRef]);
};

export default useCanvasBackgroudColor;
