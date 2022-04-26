import React from "react";
import { UseCanvas } from "../hooks/useCanvas";
import { ReactCanvas } from "./CanvasContainer";

const AlgorithmCanvas: React.FC<UseCanvas & ReactCanvas> = ({ setMyCanvasRef, height, width }) => {

  return <canvas ref={setMyCanvasRef} height={height} width={width}/>;
};

export default AlgorithmCanvas;
