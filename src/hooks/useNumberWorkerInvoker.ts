import { useCallback, useEffect } from "react";
import useWorkerManager from "./useWorkerManager";

const useNumberWorkerInvoker = (input: number, cb: (output: number | null) => void) => {
    const runWorker = useWorkerManager<number, number>(cb);

    return useCallback(() => {
        runWorker(input);
    }, [input]);


}

export default useNumberWorkerInvoker;