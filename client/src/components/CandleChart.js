import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Chart = ({ stock }) => {
  const ref = useRef();
  useEffect(() => {
    makeChart(stock);
  }, [stock]);

  const makeChart = async (stock) => {
    if (!stock) return;
    const height = 500;
    const width = 500;
    const margin = 50;

    const data = JSON.parse(localStorage.getItem("data"));

    let dateArr = [];

    // data.forEach((d) => {
    //   d.datetime = new Date(d.datetime);
    // });
    //const formatDate = d3.timeFormat("%-m/%-d");

    data.forEach((d, i) => {
      //d.datetime = new Date(d.datetime);
      dateArr.push(new Date(d.datetime));
    });

    console.log(data[0].datetime);
    console.log(d3.utcDay(dateArr[0]));

    // const x = d3
    //   .scaleBand()
    //   .domain(
    //     d3.utcDay
    //       .range(dateArr[0], dateArr[dateArr.length - 1] + 1)
    //       .filter((d) => d.getUTCDay() !== 0 && d.getUTCDay() !== 6)
    //   )
    //   .range([margin, width - margin]);
    const x = d3
      .scaleBand()
      .domain(dateArr)
      .range([margin, width - margin]);

    const y = d3
      .scaleLog()
      .domain([d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)])
      .rangeRound([height - margin, margin]);

    const yAxis = (g) =>
      g
        .attr("transform", `translate(${margin}, 0)`)
        .call(
          d3
            .axisLeft(y)
            .tickFormat(d3.format("$~f"))
            .tickValues(d3.scaleLinear().domain(y.domain()).ticks())
        )
        .call((g) =>
          g
            .selectAll(".tick line")
            .clone()
            .attr("stroke-opacity", 0.2)
            .attr("x2", width - margin * 2)
        )
        .call((g) => g.select(".domain").remove());

    const xAxis = (g) =>
      g
        .attr("transform", `translate(0, ${height - margin})`)
        .call(d3.axisBottom(x));

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("height", height)
      .attr("width", width)
      .attr("viewBox", [0, 0, width, height]);

    svg.append("g").call(yAxis);
    svg.append("g").call(xAxis);

    const g = svg
      .append("g")
      .attr("stoke-linecap", "round")
      .attr("stroke", "black")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${x(d.datetime)}, 0)`);

    g.append("line")
      .attr("y1", (d) => y(d.low))
      .attr("y2", (d) => y(d.high));

    g.append("line")
      .attr("y1", (d) => y(d.open))
      .attr("y2", (d) => y(d.close))
      .attr("stroke-width", x.bandwidth())
      .attr("stroke", (d) =>
        d.open > d.close
          ? d3.schemeSet1[0]
          : d.close > d.open
          ? d3.schemeSet1[2]
          : d3.schemeSet1[8]
      );
  };

  return (
    <div
      style={{ border: "red solid 1px" }}
      ref={ref}
      className="svg-container"
    ></div>
  );
};

export default Chart;
