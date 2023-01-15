//import HeaderCartButton from './header-cart-button';
import chart from "../../assets/chart2.jpg";
import classes from "./header.module.css";

const Header = () => {
  return (
    <>
      <header className={classes.header}>
        <h1>Small Trader</h1>
        {/* <HeaderCartButton /> */}
      </header>
      <div className={classes["main-image"]}>
        <img src={chart} alt="A red chart" />
      </div>
    </>
  );
};

export default Header;
