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
  schemeCategory10,
  transition,
  mouse,
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
  dateDomain?: Date[];
  yParam?: string;
  yDomain: string[];
  sizeParam?: string;
  colorParam?: string;
  tooltipFunction?: (d: DataElementType) => string;
}

type PlottableAdapterFunctionFromKey<T extends PlottableDataType> = (
  key: string
) => PlottableAdapterFunction<T>;

const identityFunctionFactory: PlottableAdapterFunctionFromKey<PlottableDataType> = key => d =>
  d[key];
const parseDateFactory: PlottableAdapterFunctionFromKey<Date> = key => d =>
  new Date(d[key] as number | string);
const parseNumberFactory: PlottableAdapterFunctionFromKey<number> = key => d =>
  parseInt(d[key] as string);

const tooltipFunctionDefault = (d: DataElementType) => {
  return `${d['entity.State']} - ${d['value']}`;
};

export const BubbleChart = ({
  data,
  dateParam = 'duration.start',
  dateDomain,
  yParam = 'entity.State',
  yDomain,
  colorParam = 'indicator.id',
  sizeParam = 'value',
  tooltipFunction = tooltipFunctionDefault,
}: BubbleChartProps) => {
  const d3container = useRef(null);

  useEffect(() => {
    const xTicks = 5;
    const dateParseFunction = parseDateFactory(dateParam);
    const yParseFunction = identityFunctionFactory(yParam);
    const sizeParseFunction = parseNumberFactory(sizeParam);
    const colorParseFunction = identityFunctionFactory(colorParam);
    if (data && d3container.current) {
      const margin = { top: 10, right: 10, bottom: 30, left: 110 };
      const width = 954;
      const height = 500;

      select(d3container.current)
        .attr(`viewBox`, `0 0 ${width} ${height}`)
        .selectAll(`g.graphContainer`)
        .data([null])
        .enter()
        .append(`g`)
        .attr(`class`, `graphContainer`)
        .style(`font-size`, `14px`)
        .style(`font-family`, `Roboto sans-serif`)
        .attr(`transform`, `translate(${margin.left}, ${margin.top})`);

      const svg = select(`g.graphContainer`);

      const minX =
        dateDomain?.[0] ??
        min<DataElementType, Date>(data, dateParseFunction) ??
        new Date(0);
      const maxX =
        dateDomain?.[1] ??
        max<DataElementType, Date>(data, dateParseFunction) ??
        new Date();
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

      const sizeParamMax = max(data, sizeParseFunction);
      const zDomainMax = sizeParamMax || 1000;
      const z = scaleLog()
        .domain([0.0000001, zDomainMax])
        .range([1, 4]);

      const color = scaleOrdinal()
        .domain(data.map(colorParseFunction) as string[])
        .range(schemeCategory10);

      svg
        .selectAll(`g.tooltip`)
        .data([null])
        .enter()
        .append(`g`)
        .attr(`class`, `tooltip`)
        .style(`opacity`, 0)
        .style(`background-color`, `black`)
        .style(`border-radius`, `5px`)
        .style(`padding`, `10px`)
        .style(`color`, `white`)
        .attr(`transform`, `translate(0, 0)`);

      const tooltip = select(`g.tooltip`);

      const showTooltip = function(this: SVGCircleElement, d: DataElementType) {
        tooltip.transition().duration(200);
        tooltip
          .style('opacity', 1)
          .html('Country: ' + d.value)
          .attr(
            `transform`,
            `translate(${mouse(this)[0] + 30} ${mouse(this)[1] + 30})`
          );
        tooltip
          .selectAll('text')
          .data([null])
          .join('text')
          .text(`${tooltipFunction(d)}`);
      };
      const moveTooltip = function(this: SVGCircleElement, _d: any) {
        tooltip.attr(
          `transform`,
          `translate(${mouse(this)[0] + 30} ${mouse(this)[1] + 30})`
        );
      };
      const hideTooltip = function(_d: any) {
        tooltip
          .transition()
          .duration(200)
          .style('opacity', 0);
      };

      svg
        .selectAll<SVGCircleElement, DataElementType>(`circle`)
        .data<DataElementType>(data)
        .join<SVGCircleElement>(`circle`)
        .attr(`class`, `dot`)
        .on('mouseover', showTooltip)
        .on('mousemove', moveTooltip)
        .on('mouseleave', hideTooltip)
        .transition()
        .duration(750)
        .style(`stroke`, `none`)
        .attr(`cx`, d => x(dateParseFunction(d)))
        .attr(`cy`, d => y(yParseFunction(d) as string) as number)
        .attr(`r`, d => (z(sizeParseFunction(d)) as number) || 0)
        .style(`fill`, d => color(colorParseFunction(d) as string) as string)
        .style(`opacity`, `1`);
    }
  }, [
    data,
    dateParam,
    dateDomain,
    yParam,
    yDomain,
    sizeParam,
    colorParam,
    tooltipFunction,
  ]);

  return <svg height="100%" width="100%" ref={d3container} />;
};
