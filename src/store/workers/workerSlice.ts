import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// State of workers
export enum WorkerState {
    NOT_INITIALIZED = 'NOT_INITIALIZED',
    STOPPED = 'STOPPED',
    RUNNING = 'RUNNING'
}


export interface WorkerSlice {
    worker: WorkerState;
}

// Initial state object
const initialWorkerSliceState: WorkerSlice = {
    worker: WorkerState.NOT_INITIALIZED,
}

// Slice creator
const slice = createSlice({
    name: 'workers',
    initialState: initialWorkerSliceState,
    reducers: {
        setWorkerStopped: (state: WorkerSlice) =>({
            ...state,
            worker: WorkerState.STOPPED,
        }),
    },
});

export default slice.reducer