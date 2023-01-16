import classes from "./sign-in-btn.module.css";
import { clientEvents } from "../../emiter/client-events";

const SignInBtn = (props) => {
  const openCart = () => {
    clientEvents.emit("ECartClicked");
  };

  return (
    <button className={classes.button} onClick={openCart}>
      <span>Sign up</span>
    </button>
  );
};

export default SignInBtn;
