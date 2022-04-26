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
  const costData = useSelector(({ cost }: RootState) =>
    cost.algorithms[Algorithms.TWO_OPT] &&
    cost.algorithms[Algorithms.TWO_OPT].cost
      ? cost.algorithms[Algorithms.TWO_OPT].cost
      : []
  );

  const [series, setSeries] = useState<TimeSeries>(
    new TimeSeries({
      name: "USD_vs_EURO",
      columns: ["time", "value"],
      points: [[Date.now(), 100]],
    })
  );

  useEffect(() => {
    if (costData.length > 0) {
      const newSeries = new TimeSeries({
        name: "USD_vs_EURO",
        columns: ["time", "value"],
        points: costData,
      });
      setSeries(newSeries);
    }
  }, [costData.length]);

  return (
    <Resizable>
      <ChartContainer
        title="TSP Algorithm Comparison"
        titleStyle={{ fill: "#555", fontWeight: 500 }}
        timeRange={series.range()}
        format="%S.%L" //"%b '%y"
        timeAxisTickCount={5}
      >
        <ChartRow height="300">
          <YAxis
            id="cost"
            label="Cost (Pixel Distance)"
            min={!!series && series.min()}
            max={!!series && series.max()}
            width="60"
            format=","
          />
          <Charts>
            <LineChart axis="cost" series={series} style={style} />
            <Baseline
              axis="price"
              style={baselineStyleLite}
              value={!!series && series.max()}
              label="Max"
              position="right"
            />
            <Baseline
              axis="price"
              style={baselineStyleLite}
              value={!!series && series.min()}
              label="Min"
              position="right"
            />
            <Baseline
              axis="price"
              style={baselineStyleExtraLite}
              value={!!series && series.avg() - series.stdev()}
            />
            <Baseline
              axis="price"
              style={baselineStyleExtraLite}
              value={!!series && series.avg() + series.stdev()}
            />
            <Baseline
              axis="price"
              style={baselineStyle}
              value={!!series && series.avg()}
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
