import React, { useEffect, useState } from "react";
import useCanvas from "../hooks/useCanvas";
import useCanvasBackgroudColor from "../hooks/useCanvasBackgroundColor";
import useClearCanvas from "../hooks/useClearCanvas";
import useMakeClickableCanvas from "../hooks/useMakeClickableCanvas";
import useMakeRandomCanvas from "../hooks/useMakeRandomCanvas";
import useNumberWorkerInvoker from "../hooks/useNumberWorkerInvoker";
import usePointsArrayWorkerInvoker from "../hooks/usePointsArrayWorkerInvoker";
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

  // add the hook that handles the point array tasks and passes them to 
  // the worker.  This hook will return a callback that will act as 
  // our handler for the 'run' button.
  const runWorker = usePointsArrayWorkerInvoker(points);

  useCanvasBackgroudColor(clearCanvas);
  useMakeClickableCanvas(myCanvas, points, setPoints);
  

  return (
    <div>
      <div className="Button-container">
        {/* short hand function calls for succinctness */}
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
