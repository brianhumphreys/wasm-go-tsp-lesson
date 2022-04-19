import { useCallback, useEffect } from "react";
import useWorkerManager from "./useWorkerManager";

const useNumberWorkerInvoker = (input: number) => {
    const [taskResult, runWorker] = useWorkerManager<number>();
 
    useEffect(() => {
        console.log('result from worker!');
        console.log(taskResult);
    }, [taskResult]);

    return useCallback(() => {
        runWorker(input);
    }, [input]);


}

export default useNumberWorkerInvoker;