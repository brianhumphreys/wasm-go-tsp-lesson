// @ts-nocheck
import React, { SetStateAction, useEffect, useState, useMemo } from "react";
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
import { start } from "repl";

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

  const [counter, setCounter] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [series1Offset, setSeries1Offset] = useState(0);
  const [series2Offset, setSeries2Offset] = useState(0);
  const [series3Offset, setSeries3Offset] = useState(0);

  const [series1, setSeries1] = useState<TimeSeries>(
    new TimeSeries({
      name: "TSP Algorithm Cost Result Comparison",
      columns: ["time", "value"],
      points: [[Date.now(), 100]],
    })
  );

  const setStartTimeIfNotSet = (chartStartTime: number) => {
    if (startTime == 0) {
      // console.log('start time: ', startTime);
      setStartTime(chartStartTime);
    }
  };


  useEffect(() => {
    // console.log('use effect: ', startTime);
    if (states[Algorithms.TWO_OPT].cost.length > 0) {
      const seriesStartTime = states[Algorithms.TWO_OPT].cost[0][0];
      setStartTimeIfNotSet(seriesStartTime);
      // setOffsetTimeIfNotSet(startTime, seriesStartTime, series1Offset, setSeries1Offset);
      // console.log('two opt')
      // console.log(states[Algorithms.TWO_OPT].cost.map((cost) => ([cost[0] - startTime - (seriesStartTime - startTime), cost[1]])))
      const newSeries = new TimeSeries({
        name: "TSP Algorithm Cost Result Comparison",
        columns: ["time", "value"],
        points: states[Algorithms.TWO_OPT].cost.map((cost) => [
          cost[0] - startTime - (seriesStartTime - startTime),
          cost[1],
        ]),
      });
      setSeries1(newSeries);
      setCounter(counter + 1);
    }
  }, [
    states[Algorithms.TWO_OPT].cost.length,
    startTime,
    series1Offset,
    setSeries1Offset,
  ]);

  const [series2, setSeries2] = useState<TimeSeries>(
    new TimeSeries({
      name: "TSP Algorithm Cost Result Comparison",
      columns: ["time", "value"],
      points: [[Date.now(), 100]],
    })
  );

  useEffect(() => {
    // console.log('use effect: ', startTime);
    if (states[Algorithms.GENETIC].cost.length > 0) {
      const seriesStartTime = states[Algorithms.GENETIC].cost[0][0];
      setStartTimeIfNotSet(seriesStartTime);
      const newSeries = new TimeSeries({
        name: "TSP Algorithm Cost Result Comparison",
        columns: ["time", "value"],
        points: states[Algorithms.GENETIC].cost.map((cost) => [
          cost[0] - startTime - (seriesStartTime - startTime),
          cost[1],
        ]),
      });
      setSeries2(newSeries);
      setCounter(counter + 1);
    }
  }, [
    states[Algorithms.GENETIC].cost.length,
    startTime,
    series2Offset,
    setSeries2Offset,
  ]);

  const [series3, setSeries3] = useState<TimeSeries>(
    new TimeSeries({
      name: "TSP Algorithm Cost Result Comparison",
      columns: ["time", "value"],
      points: [[Date.now(), 100]],
    })
  );

  useEffect(() => {
    if (states[Algorithms.ANNEALING].cost.length > 0) {
      const seriesStartTime = states[Algorithms.ANNEALING].cost[0][0];
      setStartTimeIfNotSet(seriesStartTime);
      const newSeries = new TimeSeries({
        name: "TSP Algorithm Cost Result Comparison",
        columns: ["time", "value"],
        points: states[Algorithms.ANNEALING].cost.map((cost) => [
          cost[0] - startTime - (seriesStartTime - startTime),
          cost[1],
        ]),
      });
      setSeries3(newSeries);
    }
  }, [
    states[Algorithms.ANNEALING].cost.length,
    startTime,
    series3Offset,
    setSeries3Offset,
  ]);

  const chartStyler1 = styler([{ key: "value", color: "#ff0000", width: 3 }]);
  const chartStyler2 = styler([{ key: "value", color: "#00ff00", width: 3 }]);
  const chartStyler3 = styler([{ key: "value", color: "#0000ff", width: 3 }]);

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [timeRange, setTimeRange] = useState(series1.range());

  useEffect(() => {
    const seriesArray = [series1, series2, series3];
    const minSeriesIndex = seriesArray.reduce((minIdx, series, curIdx) => {
      if (seriesArray[minIdx].min() > series.min()) {
        return curIdx;
      } else return minIdx;
    }, 0);
    const maxSeriesIndex = seriesArray.reduce((maxIdx, series, curIdx) => {
      if (seriesArray[maxIdx].max() < series.max()) {
        return curIdx;
      } else return maxIdx;
    }, 0);
    const timeRangeIndex = seriesArray.reduce((trIdx, series, curIdx) => {
      if (seriesArray[trIdx].range().duration() < series.range().duration()) {
        return curIdx;
      } else return trIdx;
    }, 0);
    setMin(seriesArray[minSeriesIndex].min());
    setMax(seriesArray[maxSeriesIndex].max());
    setTimeRange(seriesArray[timeRangeIndex].range());
  }, [series1, series2, series3]);

  const chartComponent = useMemo(() => {
    return (
      <Resizable>
        <ChartContainer
          title="TSP Algorithm Cost Result Comparison"
          titleStyle={{ fill: "#555", fontWeight: 500 }}
          timeRange={timeRange}
          format="%S.%L" //"%b '%y"
          timeAxisTickCount={6}
          width={700}
        >
          {/* <Legend type="line" style={chartStyler1} categories={legend} /> */}
          <ChartRow height="300">
            <YAxis
              id="cost"
              label="Cost (Pixel Distance)"
              min={min - 30}
              max={max + 30}
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
                value={series1.max()}
                label="Start Cost"
                position="left"
              />
              <Baseline
                axis="cost"
                style={baselineStyleLite}
                value={series2.max()}
                label="Start Cost"
                position="left"
              />
              <Baseline
                axis="cost"
                style={baselineStyleLite}
                value={series3.max()}
                label="Start Cost"
                position="left"
              />
              <Baseline
                axis="cost"
                style={baselineStyleLite}
                value={series1.min()}
                label="End Cost"
                position="right"
                vposition="below"
              />
              <Baseline
                axis="cost"
                style={baselineStyleLite}
                value={series2.min()}
                label="End Cost"
                position="right"
                vposition="below"
              />
              <Baseline
                axis="cost"
                style={baselineStyleLite}
                value={series3.min()}
                label="End Cost"
                position="right"
                vposition="below"
              />
              {/* <Baseline
                axis="cost"
                style={baselineStyleExtraLite}
                value={series2.avg() - series2.stdev()}
              />
              <Baseline
                axis="cost"
                style={baselineStyleExtraLite}
                value={series2.avg() + series2.stdev()}
              />
              <Baseline
                axis="cost"
                style={baselineStyle}
                value={series2.avg()}
                label="Avg"
                position="right"
              /> */}
            </Charts>
          </ChartRow>
        </ChartContainer>
      </Resizable>
    );
  }, [min, max, timeRange]);

  return <div className="Chart-container">{chartComponent}</div>;
};

export default Chart;
