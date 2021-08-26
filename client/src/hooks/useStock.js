import { useEffect, useState } from "react";
import { StockChart } from "../helper";

const useStock = (loading, symbol) => {
  const [stock, setStock] = useState();

  useEffect(() => {
    if (!symbol) return;
    getInfo(symbol);
    // eslint-disable-next-line
  }, [symbol]);

  const getInfo = async (symbol) => {
    loading(true);
    const x = new StockChart(symbol);
    await x.getLongHistory();
    await x.getShortHistory();

    localStorage.setItem("stock", JSON.stringify(x));
    setStock(x);
    loading(false);
    // const x = JSON.parse(localStorage.getItem("stock"));
    // setStock(x);
  };

  return [stock, getInfo];
};

export default useStock;
