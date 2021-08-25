import React from "react";

const TimeSelector = ({ scope, setScope }) => {
  const x = ["1d", "1w", "1m", "3m", "6m", "1y", "2y", "5y", "10y", "All"];

  const intervals = x.map((s, i) => {
    return (
      <p
        key={i}
        id={`${scope === s ? "active-scope" : ""}`}
        onClick={(e) => setScope(e.target.innerHTML)}
      >
        {s}
      </p>
    );
  });

  return <div className="time-selector">{intervals}</div>;
};

export default TimeSelector;
