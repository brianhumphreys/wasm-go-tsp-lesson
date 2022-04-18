import { MutableRefObject, useMemo, useRef } from "react";
import { UseCanvas } from "./useCanvas";


const useCanvasRefNullCheck = (canvasRefWithNulls: MutableRefObject<HTMLCanvasElement | null>): UseCanvas => {

  console.log('first: ', canvasRefWithNulls);
  // change useEffect to useMemo.  this way we return only once
  // we have null checked both the canvas and the context.
  return useMemo<UseCanvas>(() => {
    console.log("wack: ", canvasRefWithNulls);
    const canvas = canvasRefWithNulls.current;
    if (canvas == null) {
      return null;
    }
    const context = canvas.getContext("2d");
    if (context == null) {
      return null;
    }

    // return the MyCanvas object with a canvas and a context
    // that we KNOW are not null or undefined
    return {
      canvas,
      context,
      canvasRef: canvasRefWithNulls,
    };
    // IMPORTANT : add canvasRefWithNulls.current to the dependency array
    // if only canvasRefWithNulls is added, this will not work.
    // ref updates can be tricky... refer to :
    // https://medium.com/@teh_builder/ref-objects-inside-useeffect-hooks-eb7c15198780
    // to learn more about using refs inside of hooks
  }, [canvasRefWithNulls.current]);
};

export default useCanvasRefNullCheck;
