import React, { useEffect } from "react";
//import CandleChart from "./CandleChart";
import "./app.css";
import LineChart from "./LineChart";
import Header from "./Header";
import useStock from "../hooks/useStock";

const App = () => {
  const [stock, getInfo] = useStock();

  useEffect(() => {
    getInfo("AAPL");
  }, []);

  return (
    <div className="app">
      <Header x={"first"} />
      <h1>StockChart</h1>
      {stock && <h3>{stock.symbol}</h3>}
      {/*<CandleChart stock={stock} />*/}
      <LineChart stock={stock} />
    </div>
  );
};

export default App;
