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
import usePoints from "./usePoints";
import useWorkerManager from "./useWorkerManager";

const useAlgorithmWorkerInvoker = (algorithmName: Algorithms) => {
  const dispatch = useDispatch();
  const { setPointsSingular } = usePoints();
  const { solved: isSolved, bestRoute: input } = useAlgorithm(algorithmName);

  const callback = (taskResult: Tour | null) => {
    if (taskResult != null) {
      // console.log("TASK RESULT");
      // console.log(algorithmName);
      // console.log(taskResult);
      setPointsSingular(algorithmName, taskResult.path);
      dispatch(
        addCostItem({
          algorithmName: algorithmName,
          bestRoute: taskResult.path,
          costItem: [taskResult.finishTime, taskResult.cost],
        })
      );
    }
  };

  const runWorker = useWorkerManager<Pos[], Tour>(algorithmName, callback);

  return useCallback(() => {
    if (isSolved && input.length > 1) {
      dispatch(setUnsolved({ algorithmName: algorithmName }));
      dispatch(clearCostItems(algorithmName));
      runWorker(input);
    }
  }, [hashListOfPoints(input), runWorker, isSolved]);
};

export default useAlgorithmWorkerInvoker;
