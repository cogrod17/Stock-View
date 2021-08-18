import { useEffect, useState } from "react";
import { StockChart } from "../helper";

const useStock = (symbol) => {
  const [stock, setStock] = useState(symbol);

  useEffect(() => {
    if (!symbol) return;
    getInfo(symbol);
  }, [symbol]);

  const getInfo = (symbol) => {
    const x = new StockChart(symbol);
    setStock(x);
  };

  return [stock, getInfo];
};

export default useStock;
