import { useCallback } from "react";
import { Pos } from "../types";
import useWorkerManager from "./useWorkerManager";

// lets see if we can use our worker to input an array of 2 points and output a distance between the two
const useVertexDistanceWorkerInvoker = (input: Pos[], cb: (output: number | null) => void) => {
    const runWorker = useWorkerManager<Pos[], number>(cb);

    return useCallback(() => {
        runWorker(input);
    }, [input, runWorker]);
}

export default useVertexDistanceWorkerInvoker;