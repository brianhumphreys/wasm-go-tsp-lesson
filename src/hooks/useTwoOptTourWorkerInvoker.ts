import { Dispatch, SetStateAction, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCostItems } from "../store/costSlice";
import { RootState } from "../store/store";
import { Algorithms, Pos, Tour } from "../types";
import { hashListOfPoints } from "../utilities/pointUtils";
import useWorkerManager from "./useWorkerManager";

// callback type now doesn't necessarily need to be a dispatcher method.
// we will still call setState to the canvas points bbut we want to also
// add an iteration to our cost tracking graph
const useTwoOptTourWorkerInvoker = (input: Pos[], cb: (tour: Tour) => void) => {
  const dispatch = useDispatch();
  
//   const costData = useSelector(({ cost }: RootState) => cost[Algorithms.TWO_OPT] ? cost[Algorithms.TWO_OPT] : []);

  const runWorker = useWorkerManager<Pos[], Tour>((tastResult) => {
    if (tastResult != null) {
      cb(tastResult);
    }
  });

  return useCallback(() => {
    // clear the tracker grapher when we start a new task batch
    dispatch(clearCostItems(Algorithms.TWO_OPT));
    runWorker(input);
  }, [hashListOfPoints(input), runWorker]);
};

export default useTwoOptTourWorkerInvoker;
