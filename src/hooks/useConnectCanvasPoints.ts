import { Dispatch, MutableRefObject, useEffect } from "react";
import { Pos } from "../types";
import { hashListOfPoints } from "../utilities/pointUtils";
import { MyCanvas } from "./useCanvas";

const useConnectCanvasPoints = (
  canvasRef: MutableRefObject<MyCanvas | null>,
  points: Pos[]
) => {
    useEffect(() => {

        // check that the canvas and it's context
        // are rendered to the DOM
        const myCanvas = canvasRef.current;
        if (myCanvas == null) {
          return;
        }

        // if there is only on point or no points
        // then we cannot draw any lines
        if (points.length < 2) {
            return 
        }
        const context = myCanvas.context;
    
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);

        }
        context.lineTo(points[0].x, points[0].y);
        context.stroke();
    
      }, [canvasRef, hashListOfPoints(points)]);
};

export default useConnectCanvasPoints;
