import React, { useState } from "react";
import useCanvas from "../hooks/useCanvas";
import useCanvasBackgroudColor from "../hooks/useCanvasBackgroundColor";
import useClearCanvas from "../hooks/useClearCanvas";
import useConnectCanvasPoints from "../hooks/useConnectCanvasPoints";
import useMakeClickableCanvas from "../hooks/useMakeClickableCanvas";
import useMakeRandomCanvas from "../hooks/useMakeRandomCanvas";
import useTourCostWorkerInvoker from "../hooks/useTourCostWorkerInvoker";
import { Pos } from "../types";

export type ReactCanvas = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

export interface OurCanvas extends ReactCanvas {
  draw: Function;
}

const Canvas: React.FC<OurCanvas> = (props) => {
  const { draw, ...rest } = props;

  const [points, setPoints] = useState<Pos[]>([]);
  const [myCanvas, setCanvasRef] = useCanvas();

  const clearCanvas = useClearCanvas(myCanvas, setPoints);
  const getRandomButtons = useMakeRandomCanvas(myCanvas, setPoints);

  // replace static array with points array
  const runWorker = useTourCostWorkerInvoker(points, console.log);

  useCanvasBackgroudColor(clearCanvas);
  useMakeClickableCanvas(myCanvas, points, setPoints);

  useConnectCanvasPoints(myCanvas, points);
  

  return (
    <div>
      <div className="Button-container">
        <button className="Worker-button" onClick={getRandomButtons}>
          random
        </button>
        <button className="Worker-button" onClick={() => clearCanvas()}>
          clear
        </button>
        <button className="Worker-button" onClick={() => runWorker()}>
          run
        </button>
      </div>
      <canvas ref={setCanvasRef} {...rest} />
    </div>
  );
};

export default Canvas;
