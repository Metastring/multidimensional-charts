import React, { useRef, useEffect } from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { max } from 'd3-array';
import transition from 'd3-transition';

import styles from '../d3-styles.module.css'


export const BarChart = ({data}) => {
    const d3container = useRef(null);

    useEffect(()=> {
        if (data && d3container.current) {
            const margin = {top: 10, right: 30, bottom: 30, left: 40}
            const width = 200
            const height = 200

            select(d3container.current)
                    .attr(`viewBox`, `0 0 ${width} ${height}`)
                    .attr('preserveAspectRatio', `xMidYMid meet`)
                .selectAll(`g.graphContainer`)
                    .data([null])
                    .enter().append(`g`)
                        .attr(`class`, `graphContainer`)
                        .attr(`transform`, `translate(${margin.left}, ${margin.top})`)
                        
            const svg = select(`g.graphContainer`)

            const x = scaleBand()
                .domain(data.map((_, i) => i + 1))
                .range([0, width - margin.right - margin.left])
                .padding(0.4)

            svg.selectAll(`g.xAxis`)
                .data([null])
                .enter().append("g")
                    .attr('class', 'xAxis')
                    .attr(`transform`, `translate(0, ${height - margin.bottom})`)
                .exit().remove()
            
            select(`g.xAxis`)
                .transition()
                .call(axisBottom(x));

            const y = scaleLinear()
                .domain([0, max(data)])
                .range([height - margin.bottom, 0])

            svg.selectAll(`g.yAxis`)
                .data([null])
                .enter().append("g")
                    .attr('class', 'yAxis')
                    .attr(`transform`, `translate(0, 0)`)
            
            select(`g.yAxis`)
                .transition()
                .call(axisLeft(y).ticks(4))

            const update = svg.selectAll('.bar')
                .data(data)

            update.enter()
                    .append('rect')
                    .merge(update)
                        .attr('class', 'bar')
                        .attr('x', (d, i) => x(i + 1))
                        .attr('y', d => y(d))
                        .attr('width', x.bandwidth())
                        .attr('height', d => height - margin.bottom - y(d))
                    .transition()

            update.exit().remove()

        }
    }, [data])

    return (
        <svg
            ref={d3container}
        ></svg>
    )
}

export default BarChart