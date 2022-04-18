import { Dispatch, SetStateAction, useCallback } from "react";
import { Pos } from "../types";
import { clearCanvas } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";

const useClearCanvas = (
  myCanvas: MyCanvas | null,
  setPoints: Dispatch<SetStateAction<Pos[]>>
) => {
  return useCallback(() => {
    // This is now our only null check.  currently we are only
    // returning.  Alternatiuvely,
    // we could return a casue an alert to the user to
    // refresh the page or take some other action that will assist the
    // app with rendering the canvas properly.
    if (myCanvas == null) {
      return;
    }
    if (myCanvas.canvasRef == null || !myCanvas.canvasRef.current) {
      return;
    }
    const canvas = myCanvas.canvasRef.current;
    // const canvas = myCanvas.canvas;
    const context = canvas.getContext("2d");
    if (context == null) {
      return;
    }

    clearCanvas(context, canvas.width, canvas.height);

    setPoints([]);
    // add ? to myCanvas in the case that the object is null
  }, [myCanvas?.canvasRef, myCanvas?.canvas, myCanvas?.context, setPoints]);
};

export default useClearCanvas;
