import { MutableRefObject, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { Algorithms } from "../types";

export interface MyCanvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  algorithmName: Algorithms;
}

export interface UseCanvas {
  myCanvasRef: MutableRefObject<MyCanvas | null>;
  setMyCanvasRef: (node: HTMLCanvasElement | null) => void;
  algorithmName: Algorithms;
}

const useCanvas = (algorithmName: Algorithms): UseCanvas => {
  const canvasRef = useRef<MyCanvas | null>(null);

  const setCanvasRefFunction = useCallback(
    (node: HTMLCanvasElement | null): void => {
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
        algorithmName,
      };
      // @ts-ignore
      canvasRef.current = myCanvas;

    },
    []
  );

  return { myCanvasRef: canvasRef, setMyCanvasRef: setCanvasRefFunction, algorithmName };
};

export default useCanvas;
