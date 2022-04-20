import { useCallback } from "react";
import { Pos } from "../types";
import useWorkerManager from "./useWorkerManager";

// change name but input/output remain the same as useVertexDistanceWorkerInvoker()
const useTourCostWorkerInvoker = (input: Pos[], cb: (output: number | null) => void) => {
    const runWorker = useWorkerManager<Pos[], number>(cb);

    return useCallback(() => {
        runWorker(input);
        // add length of points to the dependency array
    // }, [input.length, runWorker]);
    // todo: however, we see that if we click random, run, get a result,
    // then click random again, the result printed to the console does not
    // change.  this is because the length of the points array stayed at 100.
    // We need to do something a little more clever like hasing the array 
    // and listening to the hash of the array instead of just the length
    }, [input.length, runWorker]);
}

export default useTourCostWorkerInvoker;