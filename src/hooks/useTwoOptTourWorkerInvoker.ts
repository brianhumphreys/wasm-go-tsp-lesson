import { Dispatch, SetStateAction, useCallback } from "react";
import { Pos } from "../types";
import { hashListOfPoints } from "../utilities/pointUtils";
import useWorkerManager from "./useWorkerManager";

// since we are passing in a callback with a dispatch type, we need to change the type
// of our callback
// note that we change Pos[] | null to just Pos[].  The reason it allows nulls in the 
// first place is because if the worker is invoked before it is initialized, our 
// WorkerManger class will resolve a null.  We went over this in part one... you can 
// check out article one <HERE>.
// we want to handle the null case in this hook because we do not want our points array
// to ever be null.  We could handle the null case simply by giving setState() callback
// an empty array but that will clear the canvas if there were points drawn to it.
// This behavior might be annoying to a user that has slow internet which would cause a slow
// initialization step.
// A better approach would be to not set state at all and just leave the points in the order
// that they began in.
const useTwoOptTourWorkerInvoker = (input: Pos[], cb: Dispatch<SetStateAction<Pos[]>>) => {
    // the output of two opt is a points array
    const runWorker = useWorkerManager<Pos[], Pos[]>((tastResult) => {
        if (tastResult != null) {
            cb(tastResult);  // now typescript is happy that we have null checked our taskResult
        }
        
    });

    return useCallback(() => {
        runWorker(input);
    }, [hashListOfPoints(input), runWorker]);
}

export default useTwoOptTourWorkerInvoker;
