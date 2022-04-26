import { useCallback } from "react";
import { Algorithms } from "../types";
import useAlgorithmWorkerInvoker from "./useAlgorithmWorkerInvoker";

const useAllAlgorithmsWorkerInvoker = () => {

  const runTwoOptWorker = useAlgorithmWorkerInvoker(Algorithms.TWO_OPT);
  const runGeneticWorker = useAlgorithmWorkerInvoker(Algorithms.GENETIC);
  const runAnnealingWorker = useAlgorithmWorkerInvoker(Algorithms.ANNEALING);

  return useCallback(() => {
    runGeneticWorker();
    runTwoOptWorker();
    runAnnealingWorker();
  }, [runGeneticWorker, runTwoOptWorker]);
};

export default useAllAlgorithmsWorkerInvoker;
