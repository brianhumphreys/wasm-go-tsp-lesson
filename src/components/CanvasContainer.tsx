import React from "react";
import useAllAlgorithmsWorkerInvoker from "../hooks/useAllAlgorithmsWorkerInvokers";
import useCanvas from "../hooks/useCanvas";
import useCanvasBackgroudColor from "../hooks/useCanvasBackgroundColor";
import useClearCanvas from "../hooks/useClearCanvas";
import useConnectCanvasPoints from "../hooks/useConnectCanvasPoints";
import useMakeClickableCanvas from "../hooks/useMakeClickableCanvas";
import useMakeRandomCanvas from "../hooks/useMakeRandomCanvas";
import {
  Algorithms
} from "../types";
import AlgorithmCanvas from "./AlgorithmCanvas";
import Chart from "./Chart";

export type ReactCanvas = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

const CanvasContainer: React.FC<ReactCanvas> = ({ height, width }) => {
  const twoOptCanvas =
    useCanvas(Algorithms.TWO_OPT);
  const geneticCanvas =
    useCanvas(Algorithms.GENETIC);

  const clearCanvas = useClearCanvas([twoOptCanvas.myCanvasRef, geneticCanvas.myCanvasRef]);
  const getRandomButtons = useMakeRandomCanvas([
    twoOptCanvas.myCanvasRef,
    geneticCanvas.myCanvasRef,
  ]);

  useCanvasBackgroudColor(clearCanvas);
  useMakeClickableCanvas([twoOptCanvas.myCanvasRef, geneticCanvas.myCanvasRef]);
  useConnectCanvasPoints([twoOptCanvas, geneticCanvas]);

  const runWorkers = useAllAlgorithmsWorkerInvoker();

  // const debugOutput = useRef<HTMLSpanElement | null>(null);
  // useMouseMovePosition(myCanvas, debugOutput);

  return (
    <div className="Algorithm-container">
      <div className="Button-container">
        <button className="Worker-button" onClick={getRandomButtons}>
          random
        </button>
        <button className="Worker-button" onClick={() => clearCanvas()}>
          clear
        </button>
        <button className="Worker-button" onClick={() => runWorkers()}>
          run
        </button>
        {/* <span ref={debugOutput}></span> */}
      </div>
      <div className="Canvas-container">
        <AlgorithmCanvas
          width={width}
          height={height}
          setMyCanvasRef={twoOptCanvas.setMyCanvasRef}
          myCanvasRef={twoOptCanvas.myCanvasRef}
          algorithmName={Algorithms.TWO_OPT}
        />
        <AlgorithmCanvas
          width={width}
          height={height}
          setMyCanvasRef={geneticCanvas.setMyCanvasRef}
          myCanvasRef={geneticCanvas.myCanvasRef}
          algorithmName={Algorithms.GENETIC}
        />
      </div>

      {/* <AlgorithmCanvas myCanvasRef={myGeneticCanvas} setMyCanvasRef={setGeneticCanvasRef}/> */}
      <Chart />
    </div>
  );
};

export default CanvasContainer;
