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
  const [stock, getInfo] = useStock("QQQ");
  const [scope, setScope] = useState("1y");
  const [isOpen, setIsOpen] = useState(false);

  if (!stock)
    return <Search status={"landing"} getInfo={getInfo} toggle={setIsOpen} />;
  if (stock === "loading") return <Loader />;

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
