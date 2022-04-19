export enum WorkerEventType {
  INITIALIZED = "INITIALIZED", 
  START_INITIALIZATION = "START_INITIALIZATION", 
  FINISH = "FINISH", 
  START = "START", 
}

export enum WorkerState {
  NOT_INITIALIZED = "NOT_INITIALIZED", 
  READY = "READY", 
  RUNNING = "RUNNING", 
  TERMINATED = "TERMINATED", 
}

export interface EventData<T> {
  eventType: WorkerEventType;
  eventData: T;
}

class WorkerManager {
  workerInstance: Worker; 
  workerState: WorkerState; 

  constructor(filepath: string) {
    this.workerInstance = new Worker(filepath); 
    this.workerState = WorkerState.NOT_INITIALIZED; 
  }
  
  async initialize(): Promise<void | null> {
    if (this.workerState == WorkerState.NOT_INITIALIZED) {
      
      return this._initialize();
    } else {
      return Promise.resolve(null);
    }
  }

  async _initialize(): Promise<void> {
    
    return new Promise((resolve, reject) => {
      this.workerInstance.onmessage = (event) => {
        const { eventType }: EventData<undefined> = event.data;

        if (eventType == WorkerEventType.INITIALIZED) {
          this.setWorkerState(WorkerState.READY);
          resolve();
        } else {
          this.workerInstance.terminate();
          reject();
        }
      };

      this.workerInstance.postMessage({
        eventType: WorkerEventType.START_INITIALIZATION,
      });
    });
  }

  async run<T, R = T>(work: T): Promise<null | R> {
    if (this.workerState == WorkerState.READY) {
      return this._run(work);
    } else {
      return Promise.resolve(null);
    }
  }

  async _run<T, R = T>(work: T): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      this.workerInstance.onmessage = (event) => {
        const { eventType, eventData }: EventData<R> = event.data;

        if (eventType == WorkerEventType.FINISH) {
          this.setWorkerState(WorkerState.READY);
          resolve(eventData);
        } else {
          this.workerInstance.terminate();
          reject();
        }
      };

      const event: EventData<T> = {
        eventType: WorkerEventType.START,
        eventData: work,
      };

      this.setWorkerState(WorkerState.RUNNING);
      this.workerInstance.postMessage(event);
    });
  }

  setWorkerState(newState: WorkerState) {
    this.workerState = newState;
  }
}

export default WorkerManager;
