import { useCallback, useEffect, useState } from "react";
import WorkerManager from "../workers/WorkerManager";

const useWorkerManager = <T, R = T>(
  cb: (taskResult: R | null) => void
): ((taskData: T) => void) => {
  const [worker, setWorker] = useState<WorkerManager | null>(null);

  useEffect(() => {
    setWorker(new WorkerManager("myworker.worker.js"));
  }, []);

  useEffect(() => {
    worker && worker.initialize();
  }, [worker]);


  // instead of calling .then() on a promise,
  // we now need to call .subscribe() on the observable.
  // the interface bewteen promises and observables is
  // strikingly similar, except of course the fact that
  // observables can emit multiple values across time and
  // promises can only emit one
  return useCallback(
    (taskData: T): void => {
      !!worker && worker.run<T, R>(taskData).subscribe((result) => {
        cb(result);
      });
    },
    [worker]
  );
};

export default useWorkerManager;
