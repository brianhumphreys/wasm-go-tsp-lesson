import { MutableRefObject, useCallback, useRef } from "react";

// let's add a type to states that the context is not null
// since we are null checking and can guarantee that the
// context is going to be present.  This will help us because
// now we don't have to worry about typescript making us null
// check in other areas of our code whenever we are using the
// canvas or it's context.
export interface MyCanvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

// move coloring logic, `draw()` out of this hook because
// now we want this hook to mainly handle null checking the
// canvas ref
const useCanvas = (): [MutableRefObject<MyCanvas | null>, (node: HTMLCanvasElement | null) => void] => {
  const canvasRef = useRef<MyCanvas | null>(null);

  // pass in the current node
  const setCanvasRef = useCallback((node: HTMLCanvasElement | null): void => {
    // set canvasRef.current to the either and instance
    // of MyCanvas or null depending on the value of the canvas
    // element AKA: node, and also depending on the value of the canvas
    // element's context.  If either are null then we will set canvasRef.current
    // to null.  Now in other hooks and components, we must only check for one null
    // instead of two...  You can decide if this is overkill or a nice-to-have :)
    // Setting the current this is essentially a boiled down version of
    // what useRef does under the hood in the react source code

    const canvas = node;
    if (canvas == null) {
        // if canvas is null, set current to null then return 
        // @ts-ignore
      canvasRef.current = null;
      return;
    }
    const context = canvas.getContext("2d");
    if (context == null) {
        // if the context is null, set current to null then return
        // @ts-ignore
      canvasRef.current = null;
      return;
    }

    // canvas and context are populated, then set current to an
    // instance of MyCanvas
    const myCanvas: MyCanvas = {
      canvas,
      context,
    };
    // @ts-ignore
    canvasRef.current = myCanvas;

  }, []);

  return [canvasRef, setCanvasRef];
};

export default useCanvas;
