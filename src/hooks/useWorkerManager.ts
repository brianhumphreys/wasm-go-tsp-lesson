
   
import { useCallback, useEffect, useState } from "react";
import WorkerManager from "../workers/WorkerManager";

const useWorkerManager = <T, R = T>(cb: (taskResult: R | null) => void): ((taskData: T) => void) => {
  const [worker, setWorker] = useState<WorkerManager | null>(null);

  useEffect(() => {
    setWorker(new WorkerManager("myworker.worker.js"))
  }, []);

  useEffect(() => {
    worker && worker.initialize();
  }, [worker]);

  return useCallback((taskData: T): void => {
    worker && worker.run<T, R>(taskData).then(cb);
  }, [worker]);

};

export default useWorkerManager;