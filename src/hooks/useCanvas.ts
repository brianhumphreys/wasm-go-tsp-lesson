import { MutableRefObject, useCallback, useRef } from "react";

export interface MyCanvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

const useCanvas = (): [
  MutableRefObject<MyCanvas | null>,
  (node: HTMLCanvasElement | null) => void
] => {
  const canvasRef = useRef<MyCanvas | null>(null);

  const setCanvasRef = useCallback((node: HTMLCanvasElement | null): void => {
    const canvas = node;
    if (canvas == null) {
      // @ts-ignore
      canvasRef.current = null;
      return;
    }
    const context = canvas.getContext("2d");
    if (context == null) {
      // @ts-ignore
      canvasRef.current = null;
      return;
    }

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
