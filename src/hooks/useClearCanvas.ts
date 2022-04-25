import { Dispatch, MutableRefObject, SetStateAction, useCallback } from "react";
import { useDispatch } from "react-redux";
import { clearCostItems } from "../store/costSlice";
import { Algorithms, Pos } from "../types";
import { clearCanvas } from "../utilities/canvasUtils";
import { MyCanvas } from "./useCanvas";

const useClearCanvas = (
  canvasRef: MutableRefObject<MyCanvas | null>,
  setPoints: Dispatch<SetStateAction<Pos[]>>
): Function => {
  const dispatch = useDispatch();

  return useCallback(() => {
    const myCanvas = canvasRef.current;
    if (myCanvas == null) {
      return;
    }

    // we should clear the tracker graph and start fresh
    dispatch(clearCostItems(Algorithms.TWO_OPT))

    clearCanvas(
      myCanvas.context,
      myCanvas.canvas.width,
      myCanvas.canvas.height
    );

    setPoints([]);
  }, [canvasRef]);
};

export default useClearCanvas;
