import React, { useEffect, useState } from "react";
//import CandleChart from "./CandleChart";
import "./app.css";
import LineChart from "./LineChart";

import Slider from "./Slider";
import Header from "./Header";
import TimeSelector from "./TimeSelector";
import useStock from "../hooks/useStock";
import Loader from "./Loader";

const App = () => {
  const [stock, getInfo] = useStock();
  const [scope, setScope] = useState("1y");

  useEffect(() => {
    getInfo("AAPL");
  }, []);

  if (!stock) return <Loader />;
  return (
    <div className="app">
      <Slider />
      {/*<CandleChart stock={stock} />*/}
      <Header stock={stock} />
      <TimeSelector scope={scope} setScope={setScope} />
      <LineChart scope={scope} stock={stock} />
      <BarChart stock={stock} />
    </div>
  );
};

export default App;
