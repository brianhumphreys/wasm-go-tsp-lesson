import React, { useState } from "react";
import useCanvas from "../hooks/useCanvas";
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

  const canvasRef = useCanvas(draw);

  // pass in points and setPoints
  useMakeClickableCanvas(canvasRef, points, setPoints);

  // pass in setPoints
  const getRandomButtons = useMakeRandomCanvas(canvasRef, setPoints);

  return (
    <div>
      <div className="Button-container">
        <button className="Worker-button" onClick={() => getRandomButtons()}>
          random
        </button>
      </div>
      <canvas ref={canvasRef} {...rest} />
    </div>
  );
};

export default Canvas;
