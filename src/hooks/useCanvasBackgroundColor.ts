import { MutableRefObject, useEffect } from "react";
import { clearCanvas } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";

const useCanvasBackgroudColor = (
  clearCanvasCallback: Function
) => {
  useEffect(() => {
    clearCanvasCallback()
  }, []);
};

export default useCanvasBackgroudColor;
