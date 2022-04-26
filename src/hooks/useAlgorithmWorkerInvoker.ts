import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  addCostItem,
  clearCostItems,
  setPoints,
  setUnsolved,
} from "../store/costSlice";
import { Algorithms, Pos, Tour } from "../types";
import { hashListOfPoints } from "../utilities/pointUtils";
import useAlgorithm from "./useAlgorithm";
import useWorkerManager from "./useWorkerManager";

const useAlgorithmWorkerInvoker = (
  algorithmName: Algorithms
) => {
  const dispatch = useDispatch();
  const { solved: isSolved, bestRoute: input } = useAlgorithm(algorithmName);

  const runWorker = useWorkerManager<Pos[], Tour>((tastResult) => {
    if (tastResult != null) {
      dispatch(
        setPoints({
          algorithmName: algorithmName,
          points: tastResult.path,
        })
      );
      dispatch(
        addCostItem({
          algorithmName: algorithmName,
          bestRoute: tastResult.path,
          costItem: [tastResult.finishTime, tastResult.cost],
        })
      );
    }
  });

  return useCallback(() => {
    if (isSolved && input.length > 1) {
      dispatch(setUnsolved({ algorithmName: algorithmName }));
      dispatch(clearCostItems(algorithmName));
      runWorker(input);
    }
  }, [hashListOfPoints(input), runWorker, isSolved]);
};

export default useAlgorithmWorkerInvoker;
