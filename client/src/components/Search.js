import React, { useState } from "react";
import { alphaApiKey } from "../topSecret";
import axios from "axios";

const Search = ({ toggle, getInfo }) => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);

  const onSubmit = async (e) => {
    if (e.key !== "Enter") return;
    const r = await axios.get(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${term}&apikey=${alphaApiKey}`
    );
    console.log(r);
    setResults(r.data.bestMatches);
  };

  const onClick = (x) => {
    getInfo(x);
    toggle(false);
  };

  const renderResults = results.map((r, i) => {
    console.log(results);
    return (
      <div onClick={() => onClick(r["1. symbol"])}>
        <p>{r["1. symbol"]}</p>
        <p>{r["2. name"]}</p>
      </div>
    );
  });

  return (
    <div className="search-dimmer">
      <div className="search-container">
        <p id="close" onClick={() => toggle(false)}>
          X
        </p>
        <input
          onKeyDown={(e) => onSubmit(e)}
          className="search-input"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="symbol"
        />
        <div className="search-results">{renderResults}</div>
      </div>
    </div>
  );
};

export default Search;
