import React from "react";
import "./select.css";

const Select = ({ cbSelectMarketHandler, defaultOption, availibleOptions }) => {
  return (
    <div className="markets">
      <select
        onChange={cbSelectMarketHandler}
        className="markets__markets-list"
      >
        <option>{defaultOption}</option>
        {availibleOptions.length &&
          availibleOptions.map((market, i) => (
            <option value={market} key={i}>
              {market}
            </option>
          ))}
      </select>
    </div>
  );
};

export default Select;
