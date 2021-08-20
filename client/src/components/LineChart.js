import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const margin = { top: 0, right: 0, bottom: 0, left: 30 };

const LineChart = ({ stock }) => {
  const ref = useRef();

  useEffect(() => {
    if (!stock) return;
    makeLineChart(stock);
  }, [stock]);

  const makeLineChart = async (stock) => {
    if (!stock) return;

    const data = JSON.parse(localStorage.getItem("data"))
      .slice(30)
      .map((d) => {
        return {
          datetime: new Date(d.datetime),
          close: d.close,
        };
      })
      .sort((a, b) => a.datetime - b.datetime);

    let color =
      data[0].close > data[data.length - 1].close ? "red" : "greenyellow";
    const height = ref.current.clientHeight;
    const width = ref.current.clientWidth;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("overflow", "visible")
      .attr("viewBox", `0 0 ${width + 50} ${height + 20}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain([
        d3.min(data, (d) => d.datetime),
        d3.max(data, (d) => d.datetime),
      ])
      .range([0, width]);

    //xaxis
    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    const y = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.close), d3.max(data, (d) => +d.close)])
      .range([height, 0]);

    //yaxis
    svg.append("g").attr("class", "axis").call(d3.axisLeft(y));

    const lg = svg
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", `85%`);

    lg.append("stop")
      .attr("offset", "0%")
      .style("stop-color", color)
      .style("stop-opacity", 0.9);

    lg.append("stop")
      .attr("offset", "100%")
      .style("stop-color", "rgb(0, 0, 0)")
      .style("stop-opacity", 0);

    const curve = d3.curveLinear;

    svg
      .append("path")
      .datum(data)
      .attr("id", "area")
      .attr(
        "d",
        d3
          .area()
          .curve(curve)
          .x((d) => x(d.datetime))
          .y0(y(data[0].close))
          .y1((d) => y(d.close))
      )
      .style("fill", "url(#area-gradient)");

    svg
      .append("path")
      .datum(data)
      .attr("stroke", color)
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d.datetime))
          .y((d) => y(d.close))
      );

    const focus = svg
      .append("g")
      .append("circle")
      .style("fill", "none")
      .attr("stroke", "white")
      .attr("r", 6.6)
      .style("opacity", 0);

    const date = svg
      .append("g")
      .append("text")
      .attr("fill", "white")
      .attr("transform", `translate(${width / 2}, -20)`);

    const focusText = svg
      .append("g")
      .append("text")
      .style("opacity", 0)
      .attr("fill", "white")
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");

    const mouseover = () => {
      focus.style("opacity", 0.9);
      focusText.style("opacity", 0.9);
      date.style("opacity", 0.9);
    };

    const bisect = d3.bisector((d) => d.datetime).right;

    const mousemove = (e) => {
      const x0 = x.invert(d3.pointer(e)[0]);
      let i = bisect(data, x0);
      let d = data[i];

      date.html(`${d3.utcFormat("%b %d, %Y")(d.datetime)}`);

      focus.attr("cx", x(d.datetime)).attr("cy", y(d.close));

      focusText
        .html(`$${d3.format(",.2f")(d.close)}`)
        .attr("x", x(d.datetime) + 15)
        .attr("y", y(d.close));
    };

    const mouseout = () => {
      focus.style("opacity", 0);
      focusText.style("opacity", 0);
      date.style("opacity", 0);
    };

    svg
      .append("rect")
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", mouseover)
      .on("mousemove", (e) => mousemove(e))
      .on("mouseout", mouseout);
  };

  return <div ref={ref} className="svg-container"></div>;
};

export default LineChart;
