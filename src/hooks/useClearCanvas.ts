import { Dispatch, MutableRefObject, SetStateAction, useCallback } from "react";
import { Pos } from "../types";
import { clearCanvas } from "../utilities/canvasUtils";

// hook that encapsulates logic for clearing the canvas of all points.
// We will use the `useCallback` hook that will make our `useClearCanvas` hook
// return a callback that will act as the handler for the clear-canvas button.
// We also want to make sure we pass in the setPoints function so that we can 
// reset the points array when the callback is invoked.
const useClearCanvas = (
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  setPoints: Dispatch<SetStateAction<Pos[]>>
) => {
  return useCallback(() => {
    if (canvasRef == null || !canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (context == null) {
      return;
    }

    // import clear canvas from utilities function.  Remember that we already have this
    // function defined from when we were first creating the canvas to display as a
    // cream-colored canvas.  This function will only clear the canvas display.  We need 
    // to make sure that we clear state too.
    clearCanvas(context, canvas.width, canvas.height);

    // clear state
    setPoints([]);

    // add setPoints function to the dependencies array so we can update our callback
    // when the setPoints functions changes for any reason
  }, [canvasRef, setPoints]);
};

export default useClearCanvas;
