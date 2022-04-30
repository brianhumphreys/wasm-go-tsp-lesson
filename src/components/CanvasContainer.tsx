import React, { useRef } from "react";
import useAllAlgorithmsWorkerInvoker from "../hooks/useAllAlgorithmsWorkerInvokers";
import useCanvas from "../hooks/useCanvas";
import useCanvasBackgroudColor from "../hooks/useCanvasBackgroundColor";
import useClearCanvas from "../hooks/useClearCanvas";
import useConnectCanvasPoints from "../hooks/useConnectCanvasPoints";
import useMakeClickableCanvas from "../hooks/useMakeClickableCanvas";
import useMakeRandomCanvas from "../hooks/useMakeRandomCanvas";
import useMouseMovePosition from "../hooks/useMouseMovePosition";
import { Algorithms } from "../types";
import { annealingLink, geneticLink, twoOptLink } from "../types/links";
import AlgorithmCanvas from "./AlgorithmCanvas";
import Chart from "./Chart";

export type ReactCanvas = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

const CanvasContainer: React.FC<ReactCanvas> = ({ height, width }) => {
  const twoOptCanvas = useCanvas(Algorithms.TWO_OPT);
  const geneticCanvas = useCanvas(Algorithms.GENETIC);
  const annealingCanvas = useCanvas(Algorithms.ANNEALING);

  const clearCanvas = useClearCanvas([
    twoOptCanvas.myCanvasRef,
    geneticCanvas.myCanvasRef,
    annealingCanvas.myCanvasRef,
  ]);
  const getRandomButtons = useMakeRandomCanvas([
    twoOptCanvas.myCanvasRef,
    geneticCanvas.myCanvasRef,
    annealingCanvas.myCanvasRef,
  ]);

  useCanvasBackgroudColor(clearCanvas);
  useMakeClickableCanvas([
    twoOptCanvas.myCanvasRef,
    geneticCanvas.myCanvasRef,
    annealingCanvas.myCanvasRef,
  ]);
  useConnectCanvasPoints([twoOptCanvas, geneticCanvas, annealingCanvas]);

  const runWorkers = useAllAlgorithmsWorkerInvoker();

  const debugOutput = useRef<HTMLSpanElement | null>(null);
  useMouseMovePosition(
    [twoOptCanvas, geneticCanvas, annealingCanvas],
    debugOutput
  );

  return (
    <div className="Algorithm-container">
      <div className="Canvas-container">
        <AlgorithmCanvas
          width={width}
          height={height}
          setMyCanvasRef={twoOptCanvas.setMyCanvasRef}
          myCanvasRef={twoOptCanvas.myCanvasRef}
          algorithmName={Algorithms.TWO_OPT}
          title="Two-Opt Algorithm"
          indicatorColor="red"
          link={twoOptLink}
        />
        <AlgorithmCanvas
          width={width}
          height={height}
          setMyCanvasRef={geneticCanvas.setMyCanvasRef}
          myCanvasRef={geneticCanvas.myCanvasRef}
          algorithmName={Algorithms.GENETIC}
          title="Genetic Algorithm"
          indicatorColor="green"
          link={geneticLink}
        />
        <AlgorithmCanvas
          width={width}
          height={height}
          setMyCanvasRef={annealingCanvas.setMyCanvasRef}
          myCanvasRef={annealingCanvas.myCanvasRef}
          algorithmName={Algorithms.ANNEALING}
          title="Simulated Annealing"
          indicatorColor="blue"
          link={annealingLink}
        />
      </div>

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
        <span ref={debugOutput}></span>
      </div>
      {/* <AlgorithmCanvas myCanvasRef={myGeneticCanvas} setMyCanvasRef={setGeneticCanvasRef}/> */}
      <div className="Chart-background">
        <div className="Chart-color">
          <Chart />
        </div>
      </div>
    </div>
  );
};

export default CanvasContainer;
