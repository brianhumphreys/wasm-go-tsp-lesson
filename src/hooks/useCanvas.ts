import { MutableRefObject, useCallback, useRef } from "react";
import { clearCanvas } from "../utilities/canvasUtils";

// let's add a type to states that the context is not null
// since we are null checking and can guarantee that the
// context is going to be present.  This will help us because
// now we don't have to worry about typescript making us null
// check in other areas of our code whenever we are using the
// canvas or it's context.
export interface MyCanvas {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  }
  
  // defined a type that describes a MyCanvas object or a null.  It might seem unintuitive
  // to allow a null to be returned when we are attempting to get rid of
  // the need to null check.  However, you will see in a second that
  // now we will only need 1 null check instead of 2 which will clear up
  // a couple lines of boring code in our other hooks.
  export type UseCanvas = MyCanvas | null;

  
// move coloring logic, `draw()` out of this hook because
// now we want this hook to mainly handle null checking the
// canvas ref
const useCanvas = (): [MutableRefObject<HTMLCanvasElement | null>, (node: HTMLCanvasElement | null) => void] => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // pass in the current node
  const setCanvasRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      // set canvasRef.current to the current node
      // this is essentially a boiled down version of
      // what useRef does under the hood in the react
      // source code
      canvasRef.current = node;

      const canvas = canvasRef.current;
      if (canvas == null) {
        return;
      }
      const context = canvas.getContext("2d");
      if (context == null) {
        return;
      }

      // todo: get rid of my and put me in backgroundcolor hook
      clearCanvas(context, canvas.width, canvas.height);

    }, []);

    

    return [canvasRef, setCanvasRef];
};


export default useCanvas;
