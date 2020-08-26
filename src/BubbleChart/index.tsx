import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Numeric } from 'd3';

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
} = d3;

type InputDataType = Numeric;
type PlottableDataType = Numeric;

type DataElementType = {
  [key: string]: InputDataType;
};

type PlottableAdapterFunction = (input: DataElementType) => PlottableDataType;
export declare interface BubbleChartProps {
  data: DataElementType[];
  dateParam?: string;
  yParam?: string;
  sizeParam?: string;
  colorParam?: string;
}

type PlottableAdapterFunctionFromKey = (
  key: string
) => PlottableAdapterFunction;

const identityFunctionFactory: PlottableAdapterFunctionFromKey = key => d =>
  d[key];
const parseDateFactory: PlottableAdapterFunctionFromKey = key => d =>
  new Date(d[key] as number | string);
const parseNumberFactory: PlottableAdapterFunctionFromKey = key => d =>
  parseInt(d[key].toString());

export const BubbleChart = ({
  data,
  dateParam = 'duration.start',
  yParam = 'entity.state',
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
      const margin = { top: 10, right: 30, bottom: 30, left: 40 };
      const width = 200;
      const height = 200;

      select(d3container.current)
        .attr(`viewBox`, `0 0 ${height} ${width}`)
        .selectAll(`g.graphContainer`)
        .data([null])
        .enter()
        .append(`g`)
        .attr(`class`, `graphContainer`)
        .style(`display`, `inline-block`)
        .style(`position`, `relative`)
        .style(`width`, `100%`)
        .style(`padding-bottom`, `100%`)
        .style(`vertical-align`, `middle`)
        .style(`overflow`, `hidden`)
        .style(`font`, `14px`)
        .attr(`transform`, `translate(${margin.left}, ${margin.top})`);

      const svg = select(`g.graphContainer`);

      const minX =
        (min<InputDataType>(data.map(dateParseFunction)) as Date) ??
        new Date(0);
      const maxX =
        (max<InputDataType>(data.map(dateParseFunction)) as Date) ?? new Date();
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
        .style(`font-size`, `3px`)
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
        .domain((data.map(yParseFunction) as unknown) as string[])
        .range([height - margin.bottom, 0])
        .padding(1);

      svg
        .selectAll(`g.yAxis`)
        .data([null])
        .enter()
        .append(`g`)
        .attr(`class`, `yAxis`)
        .style(`font-size`, `3px`)
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
        .domain((data.map(colorParseFunction) as unknown) as string[])
        .range(schemeSet2);

      const update = svg
        .selectAll<SVGCircleElement, DataElementType>(`.dot`)
        .data<DataElementType>(data);

      update
        .enter()
        .append<SVGCircleElement>(`circle`)
        .merge(update)
        .attr(`class`, `dot bubble`)
        .style(`stroke`, `none`)
        .attr(`cx`, d => x(dateParseFunction(d)))
        .attr(`cy`, d => y((yParseFunction(d) as unknown) as string) as number)
        .attr(`r`, d => z(sizeParseFunction(d)) as number)
        .style(
          `fill`,
          d => color((colorParseFunction(d) as unknown) as string) as string
        )
        .style(`opacity`, `0.7`)
        .attr(`stroke`, `black`)
        .transition();

      update.exit().remove();

      svg.selectAll(`.dot.bubble:hover`).style(`stroke`, `black`);
    }
  }, [data, dateParam, yParam, sizeParam, colorParam]);

  return <svg ref={d3container}></svg>;
};
