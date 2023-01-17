import React from "react";
import classes from "./select.module.css";

const Select: React.FC<{cbSelectMarketHandler: () => void, defaultOption:string, availibleOptions:string[]}> = ({ cbSelectMarketHandler, defaultOption, availibleOptions }) => {
  return (
    <div className={classes.markets}>
      <select
        onChange={cbSelectMarketHandler}
        className={classes['markets__markets-list']}
      >
        <option value={defaultOption}>{defaultOption}</option>
        {availibleOptions.length &&
          availibleOptions.map((market:string, i:number) => (
            <option value={market} key={i}>
              {market}
            </option>
          ))}
      </select>
    </div>
  );
};

export default Select;
