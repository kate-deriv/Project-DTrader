import classes from "./sign-in-btn.module.css";
import { api } from "../../api/api";
import { clientEvents } from "../../emiter/client-events";

const LogOutBtn = () => {
  const logOut = () => {
    api.send({
      logout: 1,
    });
    clientEvents.emit("EAuthorize");
  };

  return (
    <button className={classes.button} onClick={logOut}>
      <span>Log out</span>
    </button>
  );
};

export default LogOutBtn;
