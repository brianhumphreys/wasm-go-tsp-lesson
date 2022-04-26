// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  Resizable,
  Baseline,
} from "react-timeseries-charts";
import { TimeSeries } from "pondjs";
import defaultData from "./data";
import { Algorithms } from "../types";
import useAlgorithms from "../hooks/useAlgorithms";

// // Data
// const points = [
//     [1414368000000, 30_384],
//     [1414972800000, 24_830],
//     [1415577600000, 16_840],
//     [1416182400000, 15_946],
//     [1416787200000, 14_933],
// ];
// const series = new TimeSeries({
//   name: "USD_vs_EURO",
//   columns: ["time", "value"],
//   points: [
//     [1414368000000, 30_384],
//     [1414972800000, 24_830],
//     [1415577600000, 16_840],
//     [1416182400000, 15_946],
//     [1416787200000, 14_933],
// ]
// });

const style = {
  value: {
    stroke: "#a02c2c",
    opacity: 0.2,
  },
};

const baselineStyle = {
  line: {
    stroke: "steelblue",
    strokeWidth: 1,
    opacity: 0.4,
    strokeDasharray: "none",
  },
  label: {
    fill: "steelblue",
  },
};

const baselineStyleLite = {
  line: {
    stroke: "steelblue",
    strokeWidth: 1,
    opacity: 0.5,
  },
  label: {
    fill: "steelblue",
  },
};

const baselineStyleExtraLite = {
  line: {
    stroke: "steelblue",
    strokeWidth: 1,
    opacity: 0.2,
    strokeDasharray: "1,1",
  },
  label: {
    fill: "steelblue",
  },
};

const Chart = () => {
  const states = useAlgorithms();

  const [series1, setSeries1] = useState<TimeSeries>(
    new TimeSeries({
      name: "TSP Algorithm Cost Result Comparison",
      columns: ["time", "value"],
      points: [[Date.now(), 100]],
    })
  );

  useEffect(() => {
    if (states[Algorithms.TWO_OPT].cost.length > 0) {
      const newSeries = new TimeSeries({
        name: "TSP Algorithm Cost Result Comparison",
        columns: ["time", "value"],
        points: states[Algorithms.TWO_OPT].cost,
      });
      setSeries1(newSeries);
    }
  }, [states[Algorithms.TWO_OPT].cost.length]);

  const [series2, setSeries2] = useState<TimeSeries>(
    new TimeSeries({
      name: "TSP Algorithm Cost Result Comparison",
      columns: ["time", "value"],
      points: [[Date.now(), 100]],
    })
  );

  useEffect(() => {
    if (states[Algorithms.GENETIC].cost.length > 0) {
      const newSeries = new TimeSeries({
        name: "TSP Algorithm Cost Result Comparison",
        columns: ["time", "value"],
        points: states[Algorithms.GENETIC].cost,
      });
      setSeries2(newSeries);
    }
  }, [states[Algorithms.GENETIC].cost.length]);

  const [series3, setSeries3] = useState<TimeSeries>(
    new TimeSeries({
      name: "TSP Algorithm Cost Result Comparison",
      columns: ["time", "value"],
      points: [[Date.now(), 100]],
    })
  );

  useEffect(() => {
    if (states[Algorithms.ANNEALING].cost.length > 0) {
      const newSeries = new TimeSeries({
        name: "TSP Algorithm Cost Result Comparison",
        columns: ["time", "value"],
        points: states[Algorithms.ANNEALING].cost,
      });
      setSeries3(newSeries);
    }
  }, [states[Algorithms.ANNEALING].cost.length]);

  return (
    <Resizable>
      <ChartContainer
        title="TSP Algorithm Cost Result Comparison"
        titleStyle={{ fill: "#555", fontWeight: 500 }}
        timeRange={series1.range()}
        format="%S.%L" //"%b '%y"
        timeAxisTickCount={5}
      >
        <ChartRow height="300">
          <YAxis
            id="cost"
            label="Cost (Pixel Distance)"
            min={Math.min(series1.min(), series2.min(), series3.min())}
            max={Math.max(series1.max(), series2.max(), series3.max())}
            width="60"
            format=","
          />
          <Charts>
            <LineChart axis="cost" series={series1} style={style} />
            <LineChart axis="cost" series={series2} style={style} />
            <LineChart axis="cost" series={series3} style={style} />
            <Baseline
              axis="price"
              style={baselineStyleLite}
              value={Math.max(series1.max(), series2.max(), series3.max())}
              label="Max"
              position="right"
            />
            <Baseline
              axis="price"
              style={baselineStyleLite}
              value={Math.min(series1.min(), series2.min(), series3.min())}
              label="Min"
              position="right"
            />
            <Baseline
              axis="price"
              style={baselineStyleExtraLite}
              value={series1.avg() - series1.stdev()}
            />
            <Baseline
              axis="price"
              style={baselineStyleExtraLite}
              value={series1.avg() + series1.stdev()}
            />
            <Baseline
              axis="price"
              style={baselineStyle}
              value={series1.avg()}
              label="Avg"
              position="right"
            />
          </Charts>
        </ChartRow>
      </ChartContainer>
    </Resizable>
  );
};

export default Chart;
