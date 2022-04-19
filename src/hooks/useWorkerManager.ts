
   
import { useCallback, useEffect, useState } from "react";
import WorkerManager from "../workers/WorkerManager";

const useWorkerManager = <T, R = T>(cb: (taskResult: R | null) => void): ((taskData: T) => void) => {
  // we start out as null so we do not fetch a webworker on every update
  const [worker, setWorker] = useState<WorkerManager | null>(null);

  // set worker on start up
  useEffect(() => {
    setWorker(new WorkerManager("myworker.worker.js"))
  }, []);

  // initialize worker once worker is set
  useEffect(() => {
    worker && worker.initialize();
  }, [worker]);

  // set the run worker callback once the worker is set
  return useCallback((taskData: T): void => {
    worker && worker.run<T, R>(taskData).then(cb);
  }, [worker]);

};

export default useWorkerManager;