import { MutableRefObject, useEffect } from "react";
import { Pos } from "../types";
import { clearCanvas, drawPoint } from "../utilities/canvasUtils";
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

    const context = myCanvas.context;
    const canvas = myCanvas.canvas;

    clearCanvas(context, canvas.width, canvas.height);

    if (points.length < 1) {
      return;
    }

    // starting position
    
    drawPoint(context, points[0].x, points[0].y, "#ff0000");

    for (let i = 1; i < points.length; i++) {
      // intermediate positions
      if (i == 1) {
          drawPoint(context, points[i].x, points[i].y, '#00ff00');
      } else {
        drawPoint(context, points[i].x, points[i].y);
      }
    }

    // if there is only on point or no points
    // then we cannot draw any lines
    if (points.length < 2) {
      return;
    }

    context.beginPath();
    // starting position
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      // intermediate positions
      context.lineTo(points[i].x, points[i].y);
    }
    // end position
    context.lineTo(points[0].x, points[0].y);
    context.stroke();

  }, [canvasRef, hashListOfPoints(points)]);
};

export default useConnectCanvasPoints;