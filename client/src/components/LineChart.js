import React, { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { timeIntervals } from "../helper";

const bisect = d3.bisector((d) => d.datetime).left;

const margin = { top: 0, right: 0, bottom: 0, left: 30 };

const LineChart = ({ stock, scope }) => {
  const ref = useRef();

  const formatData = (stock, scope) => {
    let data;
    let series;

    if (scope === "1w" || scope === "1m" || scope === "1d") {
      series = stock.timeSeries[scope];
    } else {
      series = stock.timeSeries["All"];
    }

    const time_series = series
      .map((d) => {
        return {
          datetime: new Date(d.datetime),
          close: d.close,
          volume: +d.volume,
        };
      })
      .sort((a, b) => a.datetime - b.datetime);

    if (scope === "All") data = time_series;
    if (scope !== "All")
      data = time_series.slice(bisect(time_series, timeIntervals[scope]));

    console.log(data);

    return data;
  };

  useEffect(() => {
    if (!stock) return;
    makeLineChart(formatData(stock, scope));
    return () => d3.select("svg").remove();
  }, [stock, scope]);

  const makeLineChart = async (data) => {
    let color = +data[0].close > +data[data.length - 1].close ? "red" : "cyan";
    const height = ref.current.clientHeight;
    const width = ref.current.clientWidth;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("overflow", "visible")
      .attr("viewBox", `0 0 ${width + 50} ${height + 20}`)
      .append("g")
      .attr("transform", `translate(${margin.left + 10},${margin.top})`);

    //xaxis
    const x = d3
      .scaleTime()
      .domain([
        d3.min(data, (d) => d.datetime),
        d3.max(data, (d) => d.datetime),
      ])
      .range([0, width]);

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    //yaxis
    const y = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => +d.close), d3.max(data, (d) => +d.close)])
      .range([height, 0]);

    // const y1 = d3
    //   .scaleLinear()
    //   .domain([d3.min(data, (d) => +d.volume), d3.max(data, (d) => +d.volume)])
    //   .range([0, height]);

    svg
      .append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).tickFormat((x) => `$${x}`));

    //adding linear gradient
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

    const gradStop = (d) =>
      scope === "All" || scope === "10y" || scope === "5y" || scope === "2y"
        ? y(d.close)
        : d.close;

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
          .y0(y(d3.min(data, (d) => gradStop(d))))
          .y1((d) => y(d.close))
      )
      .style("fill", "url(#area-gradient)");

    //adding line
    svg
      .append("path")
      .datum(data)
      .attr("stroke", color)
      .attr("fill", "none")
      .attr("stroke-width", 1)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d.datetime))
          .y((d) => y(d.close))
      );

    //focus circle
    const focus = svg
      .append("g")
      .append("circle")
      .style("fill", color)
      .attr("stroke", color)
      .attr("r", 4)
      .style("opacity", 0);

    const date = svg
      .append("g")
      .append("text")
      .attr("fill", "white")
      .attr("transform", `translate(${width / 2 - margin.left}, -20)`);

    const focusText = svg
      .append("g")
      .append("text")
      .style("opacity", 0)
      .attr("fill", "white")
      .attr("alignment-baseline", "middle");

    const mouseover = () => {
      focus.style("opacity", 1);
      focusText.style("opacity", 0.9);
      date.style("opacity", 0.9);
    };

    const mousemove = (e) => {
      const x0 = x.invert(d3.pointer(e)[0]);
      let i = bisect(data, x0);
      let d = data[i];

      if (d) {
        date.html(`${d3.utcFormat("%b %d, %Y")(d.datetime)}`);
        focus.attr("cx", x(d.datetime)).attr("cy", y(d.close));
        focusText
          .html(`$${d3.format(",.2f")(d.close)}`)
          .attr("x", x(d.datetime) - 20)
          .attr("y", y(d.close) - 30);
      }
    };

    const mouseout = () => {
      focus.style("opacity", 0);
      focusText.style("opacity", 0);
      date.style("opacity", 0);
    };

    // TRYING to add barchart for volume
    // svg
    //   .append("g")
    //   .attr("fill", "white")
    //   .selectAll("rect")
    //   .data(data)
    //   .join("rect")
    //   .attr("x", (d) => x(d.datetime))
    //   .attr("y", y1(d3.min(data, (d) => d.volume)))
    //   .attr("width", "0.2%")
    //   .attr("height", (d) => (height - y1(d.close)) * 0.1);

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
