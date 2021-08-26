import React, { useEffect } from "react";
import Loader from "./Loader";

const Notice = ({ stock, getInfo }) => {
  useEffect(() => {
    const timer = setInterval(() => getInfo(stock.symbol), 15000);
    return () => clearInterval(timer);
  });

  return (
    <div>
      <p id="api-notice">
        Data limit reached <br /> please wait a moment
      </p>
      <Loader />
    </div>
  );
};

export default Notice;
