import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setWorkerReady } from "../store/workers/workerSlice";

export enum WorkerEventType {
  INITIALIZED = "INITIALIZED",
  FINISHED = "FINISHED",
}

export interface EventData {
  eventType: WorkerEventType;
}

const useWorkerInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const worker = new Worker("myworker.worker.js");

    worker.onmessage = (event) => {
      const { eventType }: EventData = event.data;

      if (
        eventType == WorkerEventType.INITIALIZED ||
        eventType == WorkerEventType.FINISHED
      ) {
        dispatch(setWorkerReady());
      }
    };
  }, []);
};

export default useWorkerInitializer;
