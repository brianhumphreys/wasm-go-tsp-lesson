// these are the event types that will be passed back and forth
// between the worker thread and the main thread
export enum WorkerEventType {
  INITIALIZED = "INITIALIZED", // passed once from worker once initialization is compelte
  START_INITIALIZATION = "START_INITIALIZATION", // passed once to worker on initialization
  FINISH = "FINISH", // passed from worker once task is complete
  START = "START", // passed to worker when we want the task to begin
}

// The worker will keep track of it's own state which will give us an idea of when the worker
// is ready to perform a task
export enum WorkerState {
  NOT_INITIALIZED = "NOT_INITIALIZED", // worker has been instantiated but the `initialize()` method hasn't been called
  READY = "READY", // the worker is ready to be given a task
  RUNNING = "RUNNING", // the worker is currently performing a task
  TERMINATED = "TERMINATED", // the worker has been killed and cannot perform anymore tasks
}

// this is the format of the messages that will be passed back and forth between the main thread
// and the worker thread.  The generic type 'T' will be whatever data you want to pass to the
// `run()` method.  If you want to worker to perform task on a `number` type, then specify 'T'
// as type `number`
export interface EventData<T> {
  eventType: WorkerEventType;
  eventData: T;
}

// worker manager class
class WorkerManager {
  workerInstance: Worker; // reference to the actual worker
  workerState: WorkerState; // reference to worker state... READY, RUNNING, etc.

  constructor(filepath: string) {
    this.workerInstance = new Worker(filepath); // fetch the worker file
    this.workerState = WorkerState.NOT_INITIALIZED; // worker state will be NOT_INITIALIZED until the initialize command is called
  }

  // this `_initialize()` wrapper will check to see if the worker is in the correct state 
  // 'NOT_INITIALIZE' before calling the actual `initialize()` method
  async initialize(): Promise<void | null> {
    if (this.workerState == WorkerState.NOT_INITIALIZED) {
      // only call _initialize if worker is in NOT_INITIALIZED state.
      return this._initialize();
    } else {
      return Promise.resolve(null);
    }
  }

  // in the `_initialize()` method, we provide an onmessage listener that runs when the worker
  // is finished initialized.  We then send the START_INITIALIZATION event to the worker
  async _initialize(): Promise<void> {
    // passing messages back and forth between workers is an asynchronous process.  To make the
    // initialize method more friendly to use, we can wrap the process in a promise so that we
    // can use `await worker.initialize()` or `worker.initialize().then(...)`
    return new Promise((resolve, reject) => {
      this.workerInstance.onmessage = (event) => {
        const { eventType }: EventData<undefined> = event.data;

        if (eventType == WorkerEventType.INITIALIZED) {
          // worker state is set to ready now
          this.setWorkerState(WorkerState.READY);
          resolve();
        } else {
          // something went wrong when initializing... terminate worker.
          this.workerInstance.terminate();
          reject();
        }
      };

      // after setting the handler above, we can now pass the initialization message
      this.workerInstance.postMessage({
        eventType: WorkerEventType.START_INITIALIZATION,
      });
    });
  }

  // this `_run()` wrapper will check to see if the worker is in the correct state 
  // 'READY' before calling the actual `run()` method
  async run<T, R = T>(work: T): Promise<null | R> {
    if (this.workerState == WorkerState.READY) {
      return this._run(work);
    } else {
      return Promise.resolve(null);
    }
  }

  // in the `_run()` method, we provide an onmessage listener that runs when the worker
  // is finished with a task.  We then send the START event to the worker along with the 
  // data required to complete the task
  async _run<T, R = T>(work: T): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      this.workerInstance.onmessage = (event) => {
        const { eventType, eventData }: EventData<R> = event.data;

        if (eventType == WorkerEventType.FINISH) {
          // set state to ready
          this.setWorkerState(WorkerState.READY);
          resolve(eventData);
        } else {
          // something went wrong when initializing... terminate worker.
          this.workerInstance.terminate();
          reject();
        }
      };

      const event: EventData<T> = {
        eventType: WorkerEventType.START,
        eventData: work,
      };

      // set worker state to RUNNING and the tell the worker to start performing the task
      this.setWorkerState(WorkerState.RUNNING);
      this.workerInstance.postMessage(event);
    });
  }

  // helper function to set the worker state
  setWorkerState(newState: WorkerState) {
    this.workerState = newState;
  }
}

export default WorkerManager;
