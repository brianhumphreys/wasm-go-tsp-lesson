import React, { useEffect, useState } from "react";
import useCanvas from "../hooks/useCanvas";
import useClearCanvas from "../hooks/useClearCanvas";
import useMakeClickableCanvas from "../hooks/useMakeClickableCanvas";
import useMakeRandomCanvas from "../hooks/useMakeRandomCanvas";
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

  // for testing purposes, let's print out the points array state
  // whenever a point is added or whenever the array is cleared so that
  // we know our state logic is working correctly/
  useEffect(() => {
    
    console.log(points);
  }, [points.length]);

  const canvasRef = useCanvas(draw);

  useMakeClickableCanvas(canvasRef, points, setPoints);

  const getRandomButtons = useMakeRandomCanvas(canvasRef, setPoints);

  // Add hook that handles clearing of the canvas.  Make sure to pass
  // to it the point state so that we can clear the state as well
  const clearCanvas = useClearCanvas(canvasRef, setPoints);

  return (
    <div>
      <div className="Button-container">
        <button className="Worker-button" onClick={() => getRandomButtons()}>
          random
        </button>
        {/* add button and give it the clear canvas handler as the onclick method */}
        <button className="Worker-button" onClick={() => clearCanvas()}>
          clear
        </button>
      </div>
      <canvas ref={canvasRef} {...rest} />
    </div>
  );
};

export default Canvas;
