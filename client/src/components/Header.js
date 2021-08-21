import React from "react";

const Header = ({ stock }) => {
  console.log(stock);
  return (
    <div>
      <h3>{stock.symbol}</h3>
      <p>{stock.quote.close}</p>
    </div>
  );
};

export default Header;
