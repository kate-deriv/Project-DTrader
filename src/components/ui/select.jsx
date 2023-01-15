import classes from "./select.module.css";

const Select = ({ cbSelectMarketHandler, defaultOption, availibleOptions }) => {
  return (
    <div className={classes.markets}>
      <select
        onChange={cbSelectMarketHandler}
        className={classes['markets__markets-list']}
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
