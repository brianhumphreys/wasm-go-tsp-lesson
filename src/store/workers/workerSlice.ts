import { createSlice } from '@reduxjs/toolkit'

// State of workers
export enum WorkerState {
    NOT_INITIALIZED = 'NOT_INITIALIZED',
    STOPPED = 'STOPPED',
    RUNNING = 'RUNNING'
}

// The interface describing the worker slice
export interface WorkerSlice {
    worker: WorkerState;
}

// Initial state object
const initialWorkerSliceState: WorkerSlice = {
    worker: WorkerState.NOT_INITIALIZED,
}

// Slice creator
const workerSlice = createSlice({
    name: 'workers',
    initialState: initialWorkerSliceState,
    reducers: {
        setWorkerStopped: (state: WorkerSlice) =>({
            ...state,
            worker: WorkerState.STOPPED,
        }),
        setWorkerRunning: (state: WorkerSlice) =>({
            ...state,
            worker: WorkerState.RUNNING,
        }),
        setWorkerNotInitialized: (state: WorkerSlice) =>({
            ...state,
            worker: WorkerState.NOT_INITIALIZED,
        }),
    },
});

// export the actions to set the state of our
export const { setWorkerStopped, setWorkerRunning, setWorkerNotInitialized } = workerSlice.actions

// export reducer to plug into our state provider
export default workerSlice.reducer