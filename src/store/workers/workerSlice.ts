import { createSlice, PayloadAction } from '@reduxjs/toolkit'

 
// Types
export enum WorkerState {
    NOT_INITIALIZED = 'NOT_INITIALIZED',
    STOPPED = 'STOPPED',
    RUNNING = 'RUNNING'
}

export interface WorkerSlice {
    twoOptWorker: WorkerState;
}

// Initial state object
const initialWorkerSliceState: WorkerSlice = {
    twoOptWorker: WorkerState.NOT_INITIALIZED,
}

// Slice creator
const slice = createSlice({
    name: 'workers',
    initialState: initialWorkerSliceState,
    reducers: {
        setWorkerState: (state: WorkerSlice, action: PayloadAction<WorkerState>) =>({
            ...state,
            [action.payload]: action.payload,
        }),
    },
});

export default slice.reducer