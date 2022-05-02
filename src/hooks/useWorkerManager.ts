import { useCallback, useEffect, useState } from "react";
import { Algorithms } from "../types";
import WorkerManager from "../workers/WorkerManager";

const useWorkerManager = <T, R = T>(
  algorithmName: Algorithms,
  cb: (taskResult: R | null) => void
): ((taskData: T) => void) => {
  const [worker, setWorker] = useState<WorkerManager | null>(null);

  useEffect(() => {
    setWorker(new WorkerManager(`worker-${algorithmName}.js`));
  }, []);

  useEffect(() => {
    worker && worker.initialize();
  }, [worker]);


  return useCallback(
    (taskData: T): void => {
      !!worker && worker.run<T, R>(taskData).subscribe(cb);
    },
    [worker]
  );
};

export default useWorkerManager;
