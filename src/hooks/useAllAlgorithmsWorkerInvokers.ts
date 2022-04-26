import { useCallback } from "react";
import { Algorithms } from "../types";
import useAlgorithmWorkerInvoker from "./useTwoOptTourWorkerInvoker";

const useAllAlgorithmsWorkerInvoker = () => {
  //   const callback = (tour: Tour) => {
  //     dispatch(
  //       setPoints({ algorithmName: Algorithms.TWO_OPT, points: tour.path })
  //     );
  //     dispatch(
  //       addCostItem({
  //         algorithmName: Algorithms.TWO_OPT,
  //         bestRoute: tour.path,
  //         costItem: [tour.finishTime, tour.cost],
  //       })
  //     );
  //   };

  const runTwoOptWorker = useAlgorithmWorkerInvoker(Algorithms.TWO_OPT);
  const runGeneticWorker = useAlgorithmWorkerInvoker(Algorithms.GENETIC);

  return useCallback(() => {
    runGeneticWorker();
    runGeneticWorker();
  }, [runGeneticWorker, runTwoOptWorker]);
};

export default useAllAlgorithmsWorkerInvoker;
