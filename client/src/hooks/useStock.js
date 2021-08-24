import { useEffect, useState } from "react";
import { StockChart } from "../helper";

const useStock = (symbol) => {
  const [stock, setStock] = useState();

  useEffect(() => {
    if (!symbol) return;
    getInfo(symbol);
  }, [symbol]);

  const getInfo = async (symbol) => {
    setStock("loading");
    // const x = new StockChart(symbol);
    // await x.getLongHistory();
    // await x.getShortHistory();

    // localStorage.setItem("stock", JSON.stringify(x));
    // setStock(x);

    const x = JSON.parse(localStorage.getItem("stock"));
    setStock(x);
  };

  return [stock, getInfo];
};

export default useStock;
