import React, { MutableRefObject } from "react";
import { useDispatch } from "react-redux";
import { MyCanvas, UseCanvas } from "../hooks/useCanvas";
import useCanvasBackgroudColor from "../hooks/useCanvasBackgroundColor";
import useClearCanvas from "../hooks/useClearCanvas";
import useConnectCanvasPoints from "../hooks/useConnectCanvasPoints";
import useGetPoints from "../hooks/useGetPoints";
import useMakeClickableCanvas from "../hooks/useMakeClickableCanvas";
import useMakeRandomCanvas from "../hooks/useMakeRandomCanvas";
import useTwoOptTourWorkerInvoker from "../hooks/useTwoOptTourWorkerInvoker";
import { addCostItem, setPoints } from "../store/costSlice";
import { Algorithms, Tour } from "../types";

const GeneticCanvas: React.FC<UseCanvas> = ({ myCanvasRef, setMyCanvasRef }) => {
  const dispatch = useDispatch();

  return <canvas ref={setMyCanvasRef} />;
};

export default GeneticCanvas;
