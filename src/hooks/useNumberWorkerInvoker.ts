import { useCallback } from "react";
import useWorkerManager from "./useWorkerManager";

const useNumberWorkerInvoker = (input: number, cb: (output: number | null) => void) => {
    const runNumberWorker = useWorkerManager<number>(cb);

    return useCallback(() => {
        runNumberWorker(input);
    }, [input]);
}

export default useNumberWorkerInvoker;