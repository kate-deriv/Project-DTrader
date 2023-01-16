import { useState, useRef } from "react";
import { clientEvents } from "../../emiter/client-events";
import { connection, api } from "../../api/api";
import Modal from "../ui/modal";
import classes from "./sign-in-popup.module.css";

const SignInPopup = (props) => {
  const [authError, setAuthError] = useState(false);
  const [isAPIValid, setisAPIValid] = useState(true);
  const APITockenRef = useRef();

  const closeCart = () => {
    clientEvents.emit("ECartClicked");
  };

  const authorizeResponse = async (res) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      setAuthError(true);
      console.log("Error : ", data.error?.message);
      //connection.removeEventListener("message", activeResponse, false);
      return;
      //await api.disconnect();
    }

    if (data.msg_type === "authorize") {
      closeCart();
      clientEvents.emit("EAuthorize", data);
    }
  };

  const getActiveSymbols = (userTocken) => {
    connection.addEventListener("message", authorizeResponse);
    //This is my personal API tocken, you can use it for demo: QSw9m6F8QhPWf3Z
    api.send({
      authorize: userTocken,
      req_id: 1,
    });
  };

  const confirmHandler = (event) => {
    event.preventDefault();

    const userAPIToken = APITockenRef.current.value;

    if (userAPIToken.trim() === "") {
      setisAPIValid(false);
      return;
    }

    getActiveSymbols(userAPIToken);
  };

  const nameControlClasses = `${classes.control} ${
    isAPIValid ? "" : classes.invalid
  }`;

  const apiChange = () => {
    setisAPIValid(true);
  };

  let content = (
    <>
      <div className={classes.control}>
        <label htmlFor="name">Email</label>
        <input type="text" id="email" />
      </div>
      <div className={classes.control}>
        <label htmlFor="street">Password</label>
        <input type="text" id="password" />
      </div>
      <p>Or</p>
      <div className={nameControlClasses}>
        <label htmlFor="street">API token</label>
        <input
          type="text"
          id="apiToken"
          ref={APITockenRef}
          onChange={apiChange}
        />
      </div>
      <div className={classes.actions}>
        <button className={classes.button} type="button" onClick={closeCart}>
          Cancel
        </button>
        <button className={classes.button}>Log in</button>
      </div>
    </>
  );

  if (authError) {
    return (
      <Modal onClose={closeCart}>
        <div className={classes.control}>
          <p> Opps, something went wrong!</p>
          <p> Please, check you API token</p>
        </div>
        <div className={classes.actions}>
          <button className={classes.button} type="button" onClick={closeCart}>
            Cancel
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={closeCart}>
      <p>Please, fill in the form below</p>
      <form className={classes.form} onSubmit={confirmHandler}>
        {content}
      </form>
    </Modal>
  );
};

export default SignInPopup;
