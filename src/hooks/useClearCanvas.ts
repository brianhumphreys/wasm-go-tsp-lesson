import { Dispatch, MutableRefObject, SetStateAction, useCallback } from "react";
import { Pos } from "../types";
import { clearCanvas } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";

const useClearCanvas = (
  canvasRef: MutableRefObject<MyCanvas | null>,
  setPoints: Dispatch<SetStateAction<Pos[]>>
): Function => {
  return useCallback(() => {
    const myCanvas = canvasRef.current;
    if (myCanvas == null) {
      return;
    }

    clearCanvas(
      myCanvas.context,
      myCanvas.canvas.width,
      myCanvas.canvas.height
    );

    setPoints([]);
  }, [canvasRef]);
};

export default useClearCanvas;
