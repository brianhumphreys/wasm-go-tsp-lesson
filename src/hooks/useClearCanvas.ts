import { Dispatch, MutableRefObject, SetStateAction, useCallback } from "react";
import { Pos } from "../types";
import { clearCanvas } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";

const useClearCanvas = (
  canvasRef: MutableRefObject<MyCanvas | null>,
  setPoints: Dispatch<SetStateAction<Pos[]>>
) => {
  return useCallback(() => {
    // This is now our only null check.  currently we are only
    // returning.  Alternatiuvely,
    // we could return a casue an alert to the user to
    // refresh the page or take some other action that will assist the
    // app with rendering the canvas properly.
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

    setPoints([]);
    // add ? to myCanvas in the case that the object is null
  }, [canvasRef]);
};

export default useClearCanvas;
