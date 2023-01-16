import classes from "./sign-in-btn.module.css";
import { clientEvents } from "../../emiter/client-events";

const SignInBtn = (props) => {
  const openCard = () => {
    clientEvents.emit("EOpenClicked");
  };

  return (
    <button className={classes.button} onClick={openCard}>
      <span>Sign in</span>
    </button>
  );
};

export default SignInBtn;
