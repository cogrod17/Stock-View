import { useEffect, useState } from "react";
import { StockChart } from "../helper";

const useStock = (symbol) => {
  const [stock, setStock] = useState(symbol);

  useEffect(() => {
    if (!symbol) return;
    getInfo(symbol);
  }, [symbol]);

  const getInfo = async (symbol) => {
    //const x = new StockChart(symbol);
    //await x.getHistory();
    const x = localStorage.getItem("stock");
    setStock(JSON.parse(x));
  };

  return [stock, getInfo];
};

export default useStock;
