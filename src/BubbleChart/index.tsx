import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const {
  select,
  min,
  max,
  axisBottom,
  axisLeft,
  scaleTime,
  scalePoint,
  scaleLog,
  scaleOrdinal,
  schemeSet2,
  transition,
} = d3;

if (typeof transition === 'function') {
  // there is nothing to do. Just that typescript thinks we can't do things to fix bugs.
}

type InputDataType = string | number | Date;
type PlottableDataType = string | number | Date;

type DataElementType = {
  [key: string]: InputDataType;
};

type PlottableAdapterFunction<T extends PlottableDataType> = (
  input: DataElementType
) => T;
export declare interface BubbleChartProps {
  data: DataElementType[];
  dateParam?: string;
  yParam?: string;
  yDomain: string[];
  sizeParam?: string;
  colorParam?: string;
}

type PlottableAdapterFunctionFromKey<T extends PlottableDataType> = (
  key: string
) => PlottableAdapterFunction<T>;

const identityFunctionFactory: PlottableAdapterFunctionFromKey<PlottableDataType> = key => d =>
  d[key];
const parseDateFactory: PlottableAdapterFunctionFromKey<Date> = key => d =>
  new Date(d[key] as number | string);
const parseNumberFactory: PlottableAdapterFunctionFromKey<number> = key => d =>
  parseInt(d[key].toString());

export const BubbleChart = ({
  data,
  dateParam = 'duration.start',
  yParam = 'entity.state',
  yDomain,
  colorParam = 'indicator_normalized',
  sizeParam = 'value',
}: BubbleChartProps) => {
  const d3container = useRef(null);

  useEffect(() => {
    const xTicks = 5;
    const dateParseFunction = parseDateFactory(dateParam);
    const yParseFunction = identityFunctionFactory(yParam);
    const sizeParseFunction = parseNumberFactory(sizeParam);
    const colorParseFunction = identityFunctionFactory(colorParam);
    if (data && d3container.current) {
      const margin = { top: 10, right: 10, bottom: 30, left: 100 };
      const width = 600;
      const height = 300;

      select(d3container.current)
        .attr(`viewBox`, `0 0 ${width} ${height}`)
        .selectAll(`g.graphContainer`)
        .data([null])
        .enter()
        .append(`g`)
        .attr(`class`, `graphContainer`)
        .style(`font`, `14px`)
        .attr(`transform`, `translate(${margin.left}, ${margin.top})`);

      const svg = select(`g.graphContainer`);

      const minX = min<Date>(data.map(dateParseFunction)) ?? new Date(0);
      const maxX = max<Date>(data.map(dateParseFunction)) ?? new Date();
      const padding = (maxX?.getTime() - minX?.getTime()) * 0.05;

      const minDomainDate = new Date(minX.getTime() - padding);
      const maxDomainDate = new Date(maxX.getTime() + padding);

      const x = scaleTime()
        .domain([minDomainDate, maxDomainDate])
        .range([0, width - margin.right - margin.left]);

      svg
        .selectAll(`g.xAxis`)
        .data([null])
        .enter()
        .append<SVGGElement>(`g`)
        .attr(`class`, `xAxis`)
        .attr(`transform`, `translate(0, ${height - margin.bottom})`)
        .exit()
        .remove();

      const tickFormat = x.tickFormat(xTicks) as (
        value: Date | { valueOf(): number },
        i: number
      ) => string;

      select<SVGGElement, DataElementType>(`g.xAxis`).call(
        axisBottom(x)
          .ticks(xTicks)
          .tickFormat(tickFormat)
      );

      const y = scalePoint()
        .domain(yDomain ?? (data.map(yParseFunction) as string[]))
        .range([height - margin.bottom, 0])
        .padding(1);

      svg
        .selectAll(`g.yAxis`)
        .data([null])
        .enter()
        .append(`g`)
        .attr(`class`, `yAxis`)
        .attr(`transform`, `translate(0, 0)`);

      select<SVGGElement, DataElementType>(`g.yAxis`).call(
        axisLeft(y).ticks(4)
      );

      const sizeParamMax = max(data.map(sizeParseFunction));
      const zDomainMax = sizeParamMax || 1000;
      const z = scaleLog()
        .domain([1, zDomainMax])
        .range([1, 4]);

      const color = scaleOrdinal()
        .domain(data.map(colorParseFunction) as string[])
        .range(schemeSet2);

      const update = svg
        .selectAll<SVGCircleElement, DataElementType>(`.dot`)
        .data<DataElementType>(data);

      update
        .exit()
        .transition()
        .duration(750)
        .remove();

      update
        .enter()
        .append<SVGCircleElement>(`circle`)
        .merge(update)
        .transition()
        .duration(750)
        .attr(`class`, `dot bubble`)
        .style(`stroke`, `none`)
        .attr(`cx`, d => x(dateParseFunction(d)))
        .attr(`cy`, d => y(yParseFunction(d) as string) as number)
        .attr(`r`, d => z(sizeParseFunction(d)) as number)
        .style(`fill`, d => color(colorParseFunction(d) as string) as string)
        .style(`opacity`, `0.7`);

      svg.selectAll(`.dot.bubble:hover`).style(`stroke`, `black`);
    }
  }, [data, dateParam, yParam, yDomain, sizeParam, colorParam]);

  return (
    <object type="image/svg+xml">
      <svg height="90vh" width="100%" ref={d3container}></svg>
    </object>
  );
};
