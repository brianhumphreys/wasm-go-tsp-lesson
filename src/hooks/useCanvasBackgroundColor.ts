import { MutableRefObject, useEffect } from "react";
import { clearCanvas } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";

const useCanvasBackgroudColor = (
  canvasRef: MutableRefObject<MyCanvas | null>
) => {
  // if you wanted to simplyfy this hook further and keep your code dry...
  // you could invoke the useClearCanvas() hook and then invoke the returned callback
  // inside the useEffect hook since it uses the same logic.
  // the only thing that the useClearCanvas() hook does is resets the points so we need
  // to pass the setPoints function in to this hook.  Or you can pass the clearCanvas() callback
  // from the <Canvas/> element into this and directly call it in the useEffect.  I will leave this
  // up to you to decide what to do as an excercise.
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
