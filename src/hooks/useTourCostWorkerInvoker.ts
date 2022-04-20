import { useCallback } from "react";
import { Pos } from "../types";
import useWorkerManager from "./useWorkerManager";

// change name but input/output remain the same as useVertexDistanceWorkerInvoker()
const useTourCostWorkerInvoker = (input: Pos[], cb: (output: number | null) => void) => {
    const runWorker = useWorkerManager<Pos[], number>(cb);

    return useCallback(() => {
        runWorker(input);
    }, [input, runWorker]);
}

export default useTourCostWorkerInvoker;