import React, { useEffect } from "react";
//import CandleChart from "./CandleChart";
import "./app.css";
import LineChart from "./LineChart";
import Slider from "./Slider";
import Header from "./Header";
import TimeSelector from "./TimeSelector";
import useStock from "../hooks/useStock";

const App = () => {
  const [stock, getInfo] = useStock();

  useEffect(() => {
    getInfo("AAPL");
  }, []);

  if (!stock) return <div style={{ color: "white" }}>Loading</div>;

  return (
    <div className="app">
      <Slider />
      {/*<CandleChart stock={stock} />*/}
      <Header stock={stock} />
      <TimeSelector />
      <LineChart stock={stock} />
    </div>
  );
};

export default App;
