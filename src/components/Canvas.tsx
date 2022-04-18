import React, { useEffect, useState } from "react";
import useCanvas from "../hooks/useCanvas";
import useCanvasBackgroudColor from "../hooks/useCanvasBackgroundColor";
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


  // useEffect(() => {
  //   console.log(points);
  // }, [points.length]);

    


  const [canvasRef, setCanvasRef] = useCanvas();



  useEffect(() => {
    console.log("fuck: ", canvasRef);
  }, [canvasRef]);

  // add null check
  // const [canvasRef, setCanvasRef] = useCanvasRefNullCheck(canvasRef);
  useCanvasBackgroudColor(canvasRef);
  // useMakeClickableCanvas(myCanvas, points, setPoints);
  // const getRandomButtons = useMakeRandomCanvas(myCanvas, setPoints);
  // const clearCanvas = useClearCanvas(myCanvas, setPoints);

  return (
    <div>
      <div className="Button-container">
        {/* <button className="Worker-button" onClick={() => getRandomButtons()}>
          random
        </button>
        <button className="Worker-button" onClick={() => clearCanvas()}>
          clear
        </button> */}
      </div>
      <canvas ref={canvasRef} {...rest} />
    </div>
  );
};

export default Canvas;
