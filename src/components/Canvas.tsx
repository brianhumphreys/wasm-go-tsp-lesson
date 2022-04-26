import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useCanvas from "../hooks/useCanvas";
import useCanvasBackgroudColor from "../hooks/useCanvasBackgroundColor";
import useClearCanvas from "../hooks/useClearCanvas";
import useConnectCanvasPoints from "../hooks/useConnectCanvasPoints";
import useMakeClickableCanvas from "../hooks/useMakeClickableCanvas";
import useMakeRandomCanvas from "../hooks/useMakeRandomCanvas";
import useMouseMovePosition from "../hooks/useMouseMovePosition";
import useTwoOptTourWorkerInvoker from "../hooks/useTwoOptTourWorkerInvoker";
import { addCostItem, setPoints } from "../store/costSlice";
import { RootState } from "../store/store";
import { Algorithms, AlgorithmState, CostTimeSeries, Pos, Tour } from "../types";
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

  // add a method to store the iteration costs in a suitable format
  // for timeseries display
  const dispatch = useDispatch();
  const currentPath = useSelector(({ cost }: RootState) =>
    cost.algorithms[Algorithms.TWO_OPT] != null
      ? (cost.algorithms[Algorithms.TWO_OPT] as AlgorithmState).bestRoute
      : []
  );

  // const [points, setPoints] = useState<Pos[]>([]);
  const [myCanvas, setCanvasRef] = useCanvas();

  const setTwoOptPoints = (points: Pos[]) =>
    dispatch(setPoints({ algorithmName: Algorithms.TWO_OPT, points: points }));

  const clearCanvas = useClearCanvas(myCanvas, setTwoOptPoints);
  const getRandomButtons = useMakeRandomCanvas(myCanvas, setTwoOptPoints);

  // -----------------------

  // change call back to not only set points but also add to the cost array
  const runWorker = useTwoOptTourWorkerInvoker(currentPath, (tour: Tour) => {
    dispatch(setPoints({ algorithmName: Algorithms.TWO_OPT, points: tour.path }));
    dispatch(
      addCostItem({
        algorithmName: Algorithms.TWO_OPT,
        bestRoute: tour.path,
        costItem: [tour.finishTime, tour.cost],
      })
    );
  });

  // --------------------------

  useCanvasBackgroudColor(clearCanvas);
  useMakeClickableCanvas(myCanvas, currentPath, setTwoOptPoints);
  useConnectCanvasPoints(myCanvas, currentPath);

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
