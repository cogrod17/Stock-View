import React, { useState } from "react";

const Header = ({ stock, setIsOpen }) => {
  const [color, setColor] = useState(
    +stock.quote.percent_change >= 0 ? "greenyellow" : "red"
  );

  if (!stock)
    return (
      <div className="header-name">
        Pick a stock!{" "}
        <p
          onClick={() => {
            setIsOpen(true);
          }}
          id="search-btn"
        >
          Search
        </p>
      </div>
    );

  return (
    <div>
      <div className="header-name">
        <div>
          <p>{stock.symbol}</p>
          <p> {stock.quote.name}</p>
        </div>
        <p
          onClick={() => {
            setIsOpen(true);
          }}
          id="search-btn"
        >
          Search
        </p>
      </div>
      <div className="header">
        <div>
          <p>Price</p>
          <p>${Number(stock.price).toFixed(2)}</p>
        </div>
        <div>
          <p>Change</p>
          <p style={{ color }}>
            {Number(stock.quote.percent_change).toFixed(2)}%
          </p>
        </div>
        <div>
          <p>52w High</p>
          <p>${Number(stock.quote.fifty_two_week.high).toFixed(2)}</p>
        </div>
        <div>
          <p>52w Low</p>
          <p>${Number(stock.quote.fifty_two_week.low).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
