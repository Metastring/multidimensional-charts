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
} = d3;

type DataElementType = {
  [key: string]: string;
};

export declare interface BubbleChartProps {
  data: DataElementType[];
  xTicks?: number;
  dateParam?: string;
  yParam?: string;
  colorParam?: string;
  sizeParam?: string;
}

export const BubbleChart = ({
  data,
  xTicks = 5,
  dateParam = `duration.start`,
  yParam = `entity.state`,
  colorParam = `indicator`,
  sizeParam = `value`,
}: BubbleChartProps) => {
  const d3container = useRef(null);

  useEffect(() => {
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

      const minDate = min(data.map(d => new Date(d[dateParam]))) ?? new Date(0);
      const maxDate = max(data.map(d => new Date(d[dateParam]))) ?? new Date();
      const padding = (maxDate?.getTime() - minDate?.getTime()) * 0.05;

      const minDomainDate = new Date(minDate.getTime() - padding);
      const maxDomainDate = new Date(maxDate.getTime() + padding);

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
        .domain(data.map(d => d[yParam]))
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

      const sizeParamMax = max(data.map(d => parseInt(d[sizeParam])));
      const zDomainMax = sizeParamMax || 1000;
      const z = scaleLog()
        .domain([1, zDomainMax])
        .range([1, 4]);

      const color = scaleOrdinal()
        .domain(data.map(d => d[colorParam]) as string[])
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
        .attr(`cx`, function(d) {
          return x(new Date(d[dateParam]));
        })
        .attr(`cy`, d => y(d[yParam]) as number)
        .attr(`r`, d => z(parseInt(d[sizeParam])) as number)
        .style(`fill`, d => color(d[colorParam]) as string)
        .style(`opacity`, `0.7`)
        .attr(`stroke`, `black`)
        .transition();

      update.exit().remove();

      svg.selectAll(`.dot.bubble:hover`).style(`stroke`, `black`);
    }
  }, [data, xTicks, dateParam, yParam, sizeParam, colorParam]);

  return <svg ref={d3container}></svg>;
};
