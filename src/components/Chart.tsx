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
  styler,
  Legend,
} from "react-timeseries-charts";
import { TimeSeries } from "pondjs";
import defaultData from "./data";
import { Algorithms } from "../types";
import useAlgorithms from "../hooks/useAlgorithms";

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

  //   //   const trafficStyle = styler([{ key: "in", color: "orange" }, { key: "out", color: "blue" }]);
  //   const defaultStyle = {
  //     normal: { stroke: "#5a98cb", strokeWidth: 1 },
  //     highlighted: { stroke: "#5a98cb", strokeWidth: 1 },
  //     selected: { stroke: "#5a98cb", strokeWidth: 2 },
  //     muted: { stroke: "#5a98cb", opacity: 0.4, strokeWidth: 1 },
  //   };

  const chartStyler1 = styler([{ key: "value", color: "#ff0000", width: 3 }]);
  const chartStyler2 = styler([{ key: "value", color: "#00ff00", width: 3 }]);
  const chartStyler3 = styler([{ key: "value", color: "#0000ff", width: 3 }]);

  const legend = [
    {
      key: "value",
      label: "Two Opt",
    },
  ];

  return (
    <Resizable>
      <ChartContainer
        title="TSP Algorithm Cost Result Comparison"
        titleStyle={{ fill: "#555", fontWeight: 500 }}
        timeRange={series1.range()}
        format="%S.%L" //"%b '%y"
        timeAxisTickCount={5}
      >
        {/* <Legend type="line" style={chartStyler1} categories={legend} /> */}
        <ChartRow height="300">
          <YAxis
            id="cost"
            label="Cost (Pixel Distance)"
            min={Math.min(series1.min())}
            max={Math.max(series1.max())}
            width="100"
            format=","
          />

          <Charts>
            <LineChart
              axis="cost"
              series={series1}
              style={chartStyler1}
              interpolation="curveBasis"
              spacing={1}
            />
            <LineChart
              axis="cost"
              series={series2}
              style={chartStyler2}
              interpolation="curveBasis"
              spacing={1}
            />
            <LineChart
              axis="cost"
              series={series3}
              style={chartStyler3}
              interpolation="curveBasis"
              spacing={1}
            />
            <Baseline
              axis="cost"
              style={baselineStyleLite}
              value={Math.max(series1.max(), series2.max(), series3.max())}
              label="Max"
              position="right"
            />
            <Baseline
              axis="cost"
              style={baselineStyleLite}
              value={Math.min(series1.min(), series2.min(), series3.min())}
              label="Min"
              position="right"
            />
            <Baseline
              axis="cost"
              style={baselineStyleExtraLite}
              value={series1.avg() - series1.stdev()}
            />
            <Baseline
              axis="cost"
              style={baselineStyleExtraLite}
              value={series1.avg() + series1.stdev()}
            />
            <Baseline
              axis="cost"
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
