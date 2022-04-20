import { useCallback } from "react";
import { Pos } from "../types";
import { hashListOfPoints } from "../utilities/pointUtils";
import useWorkerManager from "./useWorkerManager";

const useTourCostWorkerInvoker = (input: Pos[], cb: (output: number | null) => void) => {
    const runWorker = useWorkerManager<Pos[], number>(cb);

    return useCallback(() => {
        runWorker(input);
    }, [hashListOfPoints(input), runWorker]);
}

export default useTourCostWorkerInvoker;