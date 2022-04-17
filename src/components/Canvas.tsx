import React, { useRef } from "react";
import useCanvas from "../hooks/useCanvas";
import useMakeClickableCanvas from "../hooks/useMakeClickableCanvas";

export type ReactCanvas = React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>

export interface OurCanvas extends ReactCanvas {
  draw: Function;
}

// follow this tutorial to achieve this canvas element:
// https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
const Canvas: React.FC<OurCanvas> = (props) => {

  const { draw, ...rest } = props;

  // react way of referring to canvas
  const canvasRef = useCanvas(draw);
  useMakeClickableCanvas(canvasRef);

  return <canvas ref={canvasRef} {...rest} />;
};

export default Canvas;
