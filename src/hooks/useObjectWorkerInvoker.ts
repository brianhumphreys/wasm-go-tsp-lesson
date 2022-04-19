import { useCallback } from "react";
import useWorkerManager from "./useWorkerManager";

const useObjectWorkerInvoker = (input: Object, cb: (output: Object | null) => void) => {
    const runNumberWorker = useWorkerManager<Object>(cb);

    return useCallback(() => {
        runNumberWorker(input);
    }, [input]);
}

export default useObjectWorkerInvoker;