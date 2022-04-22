import { Observable, of } from "rxjs";

// Add the ITERATE type
export enum WorkerEventType {
  INITIALIZED = "INITIALIZED", 
  ITERATE = "ITERATE", 
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


  // we need to turn our promise runner into an observable
  // so that we can get a constant stream of messages instead
  // of just esolving after one message.  RxJS is the perfect
  // for these requirements
  run<T, R = T>(work: T): Observable<null | R> {
    if (this.workerState == WorkerState.READY) {
      return this._run(work);
    } else {
      return of(null);
    }
  }

  // return an observable that can be subscribed to
  // and that will emit the results of each iteration
  // in the 2opt algorithm
  _run<T, R = T>(work: T): Observable<R> {
    return new Observable<R>((subscriber) => {
      this.workerInstance.onmessage = (event) => {
        const { eventType, eventData }: EventData<R> = event.data;

        if (eventType == WorkerEventType.FINISH) {
          this.setWorkerState(WorkerState.READY);
          subscriber.next(eventData);
          subscriber.complete();
        } else if (eventType == WorkerEventType.ITERATE) {
          subscriber.next(eventData);
        } else {
          // we should have added this a long time ago
          this.setWorkerState(WorkerState.TERMINATED);
          this.workerInstance.terminate();
          subscriber.error("something happend in the worker.");
        }
      };

      const event: EventData<T> = {
        eventType: WorkerEventType.START,
        eventData: work,
      };

      this.setWorkerState(WorkerState.RUNNING);
      this.workerInstance.postMessage(event);
    })    
  }

  setWorkerState(newState: WorkerState) {
    this.workerState = newState;
  }
}

export default WorkerManager;
