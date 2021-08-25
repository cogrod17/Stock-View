import React, { useState } from "react";
import { alphaApiKey } from "../topSecret";
import Loader from "./Loader";
import axios from "axios";

const Search = ({ toggle, getInfo, status }) => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);

  const onSubmit = async (e) => {
    if (e.key !== "Enter") return;
    setResults(["loading"]);
    const r = await axios.get(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${term}&apikey=${alphaApiKey}`
    );

    if (r.data.Note) setResults(["please try again in 1 minute"]);
    else if (!r.data.bestMatches.length) setResults(["No matches"]);
    else setResults(r.data.bestMatches);
  };

  const onClick = (x) => {
    getInfo(x);
    toggle(false);
  };

  const renderResults = () => {
    console.log(results);
    return results.map((r, i) => {
      if (r === "please try again in 1 minute" || r === "No matches")
        return (
          <div key={i}>
            <p>{r}</p>
          </div>
        );

      return (
        <div key={i} onClick={() => onClick(r["1. symbol"])}>
          <p>{r["1. symbol"]}</p>
          <p>{r["2. name"]}</p>
        </div>
      );
    });
  };

  return (
    <div className="search-dimmer">
      {status && <h3>Search a symbol to get started!</h3>}
      <div className="search-container">
        {!status && (
          <p id="close" onClick={() => toggle(false)}>
            X
          </p>
        )}
        <input
          onKeyDown={(e) => onSubmit(e)}
          className="search-input"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="symbol"
        />
        {results[0] === "loading" ? (
          <Loader />
        ) : (
          <div className="search-results">{renderResults()}</div>
        )}
      </div>
    </div>
  );
};

export default Search;
