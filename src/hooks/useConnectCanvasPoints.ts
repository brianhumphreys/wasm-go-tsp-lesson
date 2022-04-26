import { useEffect } from "react";
import { AlgorithmState } from "../types";
import { clearCanvas, drawPoint } from "../utilities/canvasUtils";
import { hashListOfPoints } from "../utilities/pointUtils";
import useAlgorithms from "./useAlgorithms";
import { UseCanvas } from "./useCanvas";

const useConnectCanvasPoints = (canvases: UseCanvas[]) => {
  const algorithms = useAlgorithms();
  
  useEffect(() => {
    console.log(...canvases.flatMap((can) => [
        hashListOfPoints((algorithms[can.algorithmName] as AlgorithmState).bestRoute),
        can.myCanvasRef,
      ]));
    canvases.forEach((canvas) => {
        const {algorithmName, myCanvasRef} = canvas;
        const {bestRoute: points} = (algorithms[algorithmName] as AlgorithmState);
        if (!myCanvasRef) {
            return;
        }
        const myCanvas = myCanvasRef.current;
        if (myCanvas == null) {
          return;
        }
    
        const context = myCanvas.context;
        const canvasEl = myCanvas.canvas;
    
        clearCanvas(context, canvasEl.width, canvasEl.height);
    
        if (points.length < 1) {
          return;
        }
    
        for (let i = 0; i < points.length; i++) {
          drawPoint(context, points[i].x, points[i].y, "#000000");
        }
    
        if (points.length < 2) {
          return;
        }
    
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
    
        for (let i = 1; i < points.length; i++) {
          context.lineTo(points[i].x, points[i].y);
        }
        context.lineTo(points[0].x, points[0].y);
        context.stroke();
    })
    
  }, [
    ...canvases.flatMap((can) => [
      hashListOfPoints((algorithms[can.algorithmName] as AlgorithmState).bestRoute),
      can.myCanvasRef,
    ]),
  ]);
};

export default useConnectCanvasPoints;
