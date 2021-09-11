import React, { useEffect, useState, useCallback } from "react";
import { format } from "d3";
import axios from "axios";
import { finPrepApiKey } from "../topSecret";

const Ticker = ({ data }) => {
  let color = data.changesPercentage > 0 ? "greenyellow" : "red";
  let transform = data.changesPercentage > 0 ? null : "rotate(180deg)";

  return (
    <div className="slider-ticker">
      <div>
        <h4>{data.ticker}</h4>
        <p>${format(",")(data.price)}</p>
      </div>
      <div style={{ color, transform }}>^</div>
      <p style={{ color }} id="percent">
        {Number(data.changesPercentage).toFixed(2)}%
      </p>
    </div>
  );
};

const Slider = () => {
  const [data, setData] = useState([]);

  const getActives = useCallback(async () => {
    const res = await axios.get(
      `https://financialmodelingprep.com/api/v3/actives?apikey=${finPrepApiKey}`
    );

    //  setData(JSON.parse(localStorage.getItem("actives")));
    setData(res.data);
  }, []);

  useEffect(() => {
    getActives();
  }, [getActives]);

  const render = () => {
    return data.map((d, i) => {
      return <Ticker key={i} data={d} />;
    });
  };

  return (
    <div className="slider-container">
      <div className={`ticker-wrap`}>{!data.length ? null : render()}</div>
    </div>
  );
};

export default Slider;
