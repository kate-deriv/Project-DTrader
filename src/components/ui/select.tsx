import React from "react";
import classes from "./select.module.css";

const Select: React.FC<{cbSelectMarketHandler: () => void, defaultOption:string, availibleOptions:string[]}> = ({ cbSelectMarketHandler, defaultOption, availibleOptions }) => {
  return (
    <div className={classes['select-wrapper']}>
      <select
        onChange={cbSelectMarketHandler}
        className={classes['select-list']}
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
