import { MutableRefObject, useEffect } from "react";
import { clearCanvas } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";

// move coloring logic from useCanvas to here
const useCanvasBackgroudColor = (
  canvasRef: MutableRefObject<MyCanvas | null>
) => {
  useEffect(() => {
    // only null check we need is this now
    const myCanvas = canvasRef.current;
    if (myCanvas == null) {
      return;
    }

    // change name to the name of the utility function.
    clearCanvas(
      myCanvas.context,
      myCanvas.canvas.width,
      myCanvas.canvas.height
    );
  }, [canvasRef]);

  //   return canvasRef;
};

export default useCanvasBackgroudColor;
