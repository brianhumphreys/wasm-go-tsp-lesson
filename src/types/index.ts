export interface Pos {
    x: number;
    y: number;
}

// create the tour interface to track iteration costs
export interface Tour {
    path: Pos[];
    cost: number;
    finishTime: number;
}

// add datatype that stores costs of each iteration to be charted
export type CostTimeSeriesItem = [number, number]
export type CostTimeSeries = CostTimeSeriesItem[];

export interface CostIteration {
    algorithmName: Algorithms;
    costItem: CostTimeSeriesItem
}

export enum Algorithms {
    TWO_OPT = "TWO_OPT",
}