import { createSlice } from "@reduxjs/toolkit";

// State of workers
export enum WorkerState {
  NOT_INITIALIZED = "NOT_INITIALIZED",
  READY = "READY",
  RUNNING = "RUNNING",
  TERMINATED = "TERMINATED",
}

// The interface describing the worker slice
export interface WorkerSlice {
  worker: WorkerState;
}

// Initial state object
const initialWorkerSliceState: WorkerSlice = {
  worker: WorkerState.NOT_INITIALIZED,
};

// Slice creator
const workerSlice = createSlice({
  name: "workers",
  initialState: initialWorkerSliceState,
  reducers: {
    setWorkerReady: (state: WorkerSlice) => ({
      ...state,
      worker: WorkerState.READY,
    }),
    setWorkerRunning: (state: WorkerSlice) => ({
      ...state,
      worker: WorkerState.RUNNING,
    }),
    setWorkerNotInitialized: (state: WorkerSlice) => ({
      ...state,
      worker: WorkerState.NOT_INITIALIZED,
    }),
    setWorkerTerminated: (state: WorkerSlice) => ({
      ...state,
      worker: WorkerState.TERMINATED,
    }),
  },
});

// export the actions to set the state of our
export const {
  setWorkerReady,
  setWorkerRunning,
  setWorkerNotInitialized,
  setWorkerTerminated,
} = workerSlice.actions;

// export reducer to plug into our state provider
export default workerSlice.reducer;
