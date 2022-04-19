import { useCallback, useEffect } from "react";
import { Pos } from "../types";
import useWorkerManager from "./useWorkerManager";

const usePointsArrayWorkerInvoker = (points: Pos[], cb: (output: Pos[] | null) => void) => {
    const runWorker = useWorkerManager<Pos[], Pos[]>(cb);
    return useCallback(() => {
        runWorker(points);
    }, [points.length]);
}

export default usePointsArrayWorkerInvoker;
