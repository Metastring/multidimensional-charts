import React, { useRef, useEffect } from 'react';
import { select } from 'd3-selection';
import { scaleOrdinal, scaleTime, scalePoint, scaleLog, scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { schemeSet2 } from 'd3-scale-chromatic';
import { max } from 'd3-array';
import transition from 'd3-transition';

import styles from '../d3-styles.module.css'
import { min } from 'd3';

const BubbleChart = ({
        data,
        xTicks = 5,
        dateParam = "duration.start",
        yParam = "entity.state",
        colorParam = "indicator",
        sizeParam = "value",
    }) => {
    const d3container = useRef(null);

    useEffect(()=> {
        if (data && d3container.current) {
            const margin = {top: 10, right: 30, bottom: 30, left: 40}
            const width = 200
            const height = 200

            select(d3container.current)
                .attr('viewBox', `0 0 ${height} ${width}`)
                .selectAll(`g.graphContainer`)
                .data([null])
                .enter().append(`g`)
                    .attr(`class`, `graphContainer`)
                    .style(`font`, `14px`)
                    .attr(`transform`, `translate(${margin.left}, ${margin.top})`)
     
            const svg = select('g.graphContainer')

            const minDate = min(data.map(d => new Date(d[dateParam]).getTime()))
            const maxDate = max(data.map(d => new Date(d[dateParam]).getTime()))
            const padding = (maxDate - minDate) * 0.05

            const x = scaleTime()
                .domain([minDate - padding, maxDate + padding])
                .range([0, width - margin.right - margin.left])
            
            svg.selectAll(`g.xAxis`)
                .data([null])
                .enter().append("g")
                    .attr('class', 'xAxis')
                    .style('font-size', '3px')
                    .attr(`transform`, `translate(0, ${height - margin.bottom})`)
                .exit().remove()
            

            select(`g.xAxis`)
                .transition()
                .call(axisBottom(x).ticks(xTicks).tickFormat(tickFormat));

            
            const y = scalePoint()
                .domain(data.map(d => d[yParam]))
                .range([height - margin.bottom, 0])
                .padding(1)

            svg.selectAll(`g.yAxis`)
                .data([null])
                .enter().append("g")
                    .attr('class', 'yAxis')
                    .style('font-size', '3px')
                    .attr(`transform`, `translate(0, 0)`)
            
            select(`g.yAxis`)
                .transition()
                .call(axisLeft(y).ticks(4))
 

            const z = scaleLog()
                .domain([1, max(data.map(d => d[sizeParam]))])
                .range([1, 4])

            const color = scaleOrdinal()
                .domain(data.map(d => d[colorParam]))
                .range(schemeSet2)

            
            const update = svg.selectAll('.dot')
                .data(data)

            update.enter()
                    .append('circle')
                    .merge(update)
                        .attr("class", `dot ${styles.bubbles}`)
                        .attr("cx", function (d) { return x(new Date(d[dateParam])); } )
                        .attr("cy", function (d) { return y(d[yParam]); } )
                        .attr("r", function (d) { return z(d[sizeParam]); } )
                        .style("fill", (d) => color(d[colorParam]))
                        .style("opacity", "0.7")
                        .attr("stroke", "black")
                    .transition()

            update.exit().remove()
        }
    }, [data, xTicks])

    return (
        <svg
            ref={d3container}
        ></svg>
    )
}

export default BubbleChart