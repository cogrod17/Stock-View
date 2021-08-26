import React, { useEffect, useState } from "react";
//import CandleChart from "./CandleChart";
import "./app.css";
import LineChart from "./LineChart";
import Slider from "./Slider";
import Header from "./Header";
import TimeSelector from "./TimeSelector";
import Notice from "./Notice";
import Search from "./Search";
import useStock from "../hooks/useStock";
import Loader from "./Loader";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stock, getInfo] = useStock(setIsLoading, null);
  const [scope, setScope] = useState("1y");
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) return <Loader />;
  if (!stock || !stock.isValid)
    return <Search stock={stock} getInfo={getInfo} toggle={setIsOpen} />;
  if (stock.apiLimit) return <Notice stock={stock} getInfo={getInfo} />;

  return (
    <div className="app">
      {isOpen && <Search getInfo={getInfo} toggle={setIsOpen} />}
      <Slider />
      <Header stock={stock} setIsOpen={setIsOpen} />
      <TimeSelector scope={scope} setScope={setScope} />
      <LineChart scope={scope} stock={stock} />
    </div>
  );
};

export default App;
