import { MutableRefObject } from "react";
import { MyCanvas } from "../hooks/useCanvas";

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


export interface AlgorithmActionPayload {
    algorithmName: Algorithms;
}

export interface CostIteration extends AlgorithmActionPayload {
    costItem: CostTimeSeriesItem;
    bestRoute: Pos[];
}


export interface AddPoint extends AlgorithmActionPayload {
    newPoint: Pos;
}

export interface SetPoints extends AlgorithmActionPayload {
    points: Pos[];
}

export enum Algorithms {
    TWO_OPT = "TWO_OPT",
    GENETIC = "GENETIC",
    ANNEALING = "ANNEALING",
}

export interface AlgorithmState {
    bestRoute: Pos[],
    bestDistance?: number;
    cost: CostTimeSeries;
    solved: boolean;
}

export interface AllAlgorithmStates {
    [algorithmName: string]: AlgorithmState | null;
}