import { Pos } from "../types";

// map over x and y values, turn them into a string and join the result string
// array into a single string that can be hashed
export const hashListOfPoints = (points: Pos[]) => {
  return hashStringValue(
    points.map((point: Pos): string => `${point.x}${point.y}`).join()
  );
};

// hash any string value into a unique (almost) integer.
// demo this function in chrome console
export const hashStringValue = (input: string): number => {
  let hash = 0;
  let char;
  if (input.length == 0) return hash;
  for (let i = 0; i < input.length; i++) {
    char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // convert to 32 bit integer
  }
  return hash;
};
