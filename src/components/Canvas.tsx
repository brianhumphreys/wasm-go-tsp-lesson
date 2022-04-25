import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import useCanvas from "../hooks/useCanvas";
import useCanvasBackgroudColor from "../hooks/useCanvasBackgroundColor";
import useClearCanvas from "../hooks/useClearCanvas";
import useConnectCanvasPoints from "../hooks/useConnectCanvasPoints";
import useMakeClickableCanvas from "../hooks/useMakeClickableCanvas";
import useMakeRandomCanvas from "../hooks/useMakeRandomCanvas";
import useMouseMovePosition from "../hooks/useMouseMovePosition";
import useTwoOptTourWorkerInvoker from "../hooks/useTwoOptTourWorkerInvoker";
import { addCostItem } from "../store/costSlice";
import { Algorithms, CostTimeSeries, Pos, Tour } from "../types";
import Chart from "./Chart";

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

  // -----------------------

  // add a method to store the iteration costs in a suitable format
  // for timeseries display
  const [costs, setCosts] = useState<CostTimeSeries>([]);
  const dispatch = useDispatch();

  // change call back to not only set points but also add to the cost array
  const runWorker = useTwoOptTourWorkerInvoker(points, (tour: Tour) => {
    setPoints(tour.path);
    console.log("task result");

    console.log(tour);
    dispatch(
      addCostItem({
        algorithmName: Algorithms.TWO_OPT,
        costItem: [tour.finishTime, tour.cost],
      })
    );
  });

  // --------------------------

  useCanvasBackgroudColor(clearCanvas);
  useMakeClickableCanvas(myCanvas, points, setPoints);
  useConnectCanvasPoints(myCanvas, points);

  // debugging
  const debugOutput = useRef<HTMLSpanElement | null>(null);
  useMouseMovePosition(myCanvas, debugOutput);

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
      <Chart />
    </div>
  );
};

export default Canvas;
