import React, { useRef, useState } from "react";
import useCanvas from "../hooks/useCanvas";
import useCanvasBackgroudColor from "../hooks/useCanvasBackgroundColor";
import useClearCanvas from "../hooks/useClearCanvas";
import useConnectCanvasPoints from "../hooks/useConnectCanvasPoints";
import useMakeClickableCanvas from "../hooks/useMakeClickableCanvas";
import useMakeRandomCanvas from "../hooks/useMakeRandomCanvas";
import useMouseMovePosition from "../hooks/useMouseMovePosition";
import useTwoOptTourWorkerInvoker from "../hooks/useTwoOptTourWorkerInvoker";
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
  const runWorker = useTwoOptTourWorkerInvoker(points, setPoints);

  useCanvasBackgroudColor(clearCanvas);
  useMakeClickableCanvas(myCanvas, points, setPoints);
  useConnectCanvasPoints(myCanvas, points);

  // debugging
  const debugOutput = useRef<HTMLSpanElement | null>(null);
  useMouseMovePosition(myCanvas, debugOutput)
  

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
        <span ref={debugOutput}></span>
      </div>
      
      
      <canvas ref={setCanvasRef} {...rest} />
    </div>
  );
};

export default Canvas;
