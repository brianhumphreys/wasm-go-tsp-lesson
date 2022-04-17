import { useEffect, useState } from "react";
import WorkerManager from "../workers/WorkerManager";

const useWorkerManager = () => {
  const [worker1] = useState(new WorkerManager("myworker.worker.js"));

  // initialize task result with no value
  const [taskResult, setTaskResult] = useState<number>();

  useEffect(() => {
    worker1.initialize();

    setTimeout(() => {
      worker1.run<number, number>(2).then((result: number) => setTaskResult(result));
    }, 1000);
  });

};

export default useWorkerManager;
