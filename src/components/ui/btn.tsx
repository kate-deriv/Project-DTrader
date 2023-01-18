import React from "react";
import classes from "./btn.module.css";

const Btn:React.FC<{btnName: string, isGreen?: boolean}> = ({btnName, isGreen = false}) => {
  const classStyle = `${classes.button} ${isGreen ? classes.green : ''}`
  return (
    <button className={classStyle}>
      <span>{btnName}</span>
    </button>
  );
};

export default Btn;
