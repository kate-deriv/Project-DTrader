import { useEffect, useState, useContext } from "react";
import { clientEvents } from "../../emiter/client-events";
import LogOutBtn from "./log-out-btn";
import SignInBtn from "./sign-in-btn";
import chart from "../../assets/chart2.jpg";
import classes from "./header.module.css";
import UserContext from "../../store/user-context";

const Header = () => {
  const ctx = useContext(UserContext)

  const [userBalance, setUserBalance] = useState(null);
  const [userCurrency, setUserCurrency] = useState(null);
  const [userName, setUserName] = useState(null);

  const EAuthorizeHandler = (data:any = null) => {
    console.log(data);
    if (!data) {
      ctx.changeIsAuthorized(false);
      return;
    }
    ctx.addUserData(data);
    ctx.changeIsAuthorized(true);
    
    setUserName(data.authorize.fullname);
    setUserBalance(data.authorize.balance);
    setUserCurrency(data.authorize.currency);
  };

  useEffect(() => {
    clientEvents.addListener("EAuthorize", EAuthorizeHandler);
    return () => {
      clientEvents.removeListener("EAuthorize", EAuthorizeHandler);
    };
  }, []);

  return (
    <>
      <header className={classes.header}>
        <h1>Small Trader</h1>
        {!ctx.isAuthorized && <SignInBtn />}
        {ctx.isAuthorized && (
          <>
            <p>Hi, {userName} !</p>
            <p>
              {userBalance} {userCurrency}
            </p>
            <LogOutBtn />
          </>
        )}
      </header>
      <div className={classes["main-image"]}>
        <img src={chart} alt="A red chart" />
      </div>
    </>
  );
};

export default Header;
