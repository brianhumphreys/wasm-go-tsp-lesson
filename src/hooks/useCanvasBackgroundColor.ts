import { MutableRefObject, useEffect } from "react";
import { clearCanvas } from "../utilities/canvasUtils";

// move coloring logic from useCanvas to here
const useCanvasBackgroudColor = (canvasRef: MutableRefObject<HTMLCanvasElement | null>) => {

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }
    const context = canvas.getContext("2d");
    if (context == null) {
      return;
    }

    // change name to the name of the utility function
    clearCanvas(context, canvas.width, canvas.height);
  }, []);

//   return canvasRef;
};

export default useCanvasBackgroudColor;
