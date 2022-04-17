import { useEffect, useState } from "react";
import WorkerManager from "../workers/WorkerManager";

const useWorkerManager = () => {
  const [worker1] = useState(new WorkerManager("myworker.worker.js"));

  // initialize task result with null
  const [taskResult, setTaskResult] = useState<number | null>(null);

  useEffect(() => {
    worker1.initialize();

    setTimeout(() => {
      worker1.run<number, number>(2).then((result: number | null) => setTaskResult(result));
    }, 1000);
  });

};

export default useWorkerManager;
