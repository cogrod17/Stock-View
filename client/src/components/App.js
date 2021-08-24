import React, { useEffect, useState } from "react";
//import CandleChart from "./CandleChart";
import "./app.css";
import LineChart from "./LineChart";
import Slider from "./Slider";
import Header from "./Header";
import TimeSelector from "./TimeSelector";
import Search from "./Search";
import useStock from "../hooks/useStock";
import Loader from "./Loader";

const App = () => {
  const [stock, getInfo] = useStock("TSLA");
  const [scope, setScope] = useState("1y");
  const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   getInfo("AAPL");
  // }, []);

  if (!stock) return <Loader />;
  console.log(stock);
  return (
    <div className="app">
      {isOpen && (
        <Search getInfo={getInfo} isOpen={isOpen} toggle={setIsOpen} />
      )}
      <Slider />
      {/*<CandleChart stock={stock} />*/}
      <Header stock={stock} setIsOpen={setIsOpen} />
      <TimeSelector scope={scope} setScope={setScope} />
      <LineChart scope={scope} stock={stock} />
    </div>
  );
};

export default App;
