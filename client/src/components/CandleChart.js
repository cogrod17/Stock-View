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
  };
  return <div ref={ref} className="svg-container"></div>;
};

export default Chart;
