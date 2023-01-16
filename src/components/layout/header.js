import { useEffect, useState } from "react";
import { clientEvents } from "../../emiter/client-events";
import LogOutBtn from "./log-out-btn";
import SignInBtn from "./sign-in-btn";
import chart from "../../assets/chart2.jpg";
import classes from "./header.module.css";

const Header = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userName, setUserName] = useState(null);

  const EAuthorizeHandler = (data = null) => {
    console.log(data);
    if (!data) {
      setIsAuthorized(false);
      return;
    }
    setIsAuthorized(true);
    setUserName(data.authorize.fullname);
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
        {!isAuthorized && <SignInBtn />}
        {isAuthorized && (
          <>
            <p>Hi, {userName} !</p>
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
