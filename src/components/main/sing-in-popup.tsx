import React, { useState, useRef } from "react";
import { clientEvents } from "../../emiter/client-events";
import { connection, api } from "../../api/api";
import Modal from "../ui/modal";
import classes from "./sign-in-popup.module.css";

const SignInPopup = () => {
  const [authError, setAuthError] = useState(false);
  const [isAPIValid, setisAPIValid] = useState(true);
  const APITockenRef = useRef<HTMLInputElement>(null);

  const closeCard = () => {
    clientEvents.emit("ECloseClicked");
  };

  const authorizeResponse = async (res:any) => {
    const data = await JSON.parse(res.data);

    if (data.error !== undefined) {
      setAuthError(true);
      console.log("Error: ", data.error?.message);
      //connection.removeEventListener("message", activeResponse, false);
      return;
      //await api.disconnect();
    }

    if (data.msg_type === "authorize") {
      closeCard();
      clientEvents.emit("EAuthorize", data);
    }
  };

  const getActiveSymbols = (userTocken:string) => {
    connection.addEventListener("message", authorizeResponse);
    //This is my personal API tocken, you can use it for demo: QSw9m6F8QhPWf3Z (real acc without money) or PHMs7GYEsGpkaWC (demo with money)
    api.send({
      authorize: userTocken,
      req_id: 1,
    });
  };

  const confirmHandler = (event:React.FormEvent) => {
    event.preventDefault();
    //Added this only for TS
    if (!APITockenRef.current) {
      return;
    }
    const userAPIToken: string | null = APITockenRef.current.value;

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
    if (isAPIValid) {
      return;
    }
    setisAPIValid(true);
  };

  let content = (
    <>
      <div className={classes.control}>
        <label htmlFor="name">Email</label>
        <input type="text" id="email" placeholder="Currently unavailable" />
      </div>
      <div className={classes.control}>
        <label htmlFor="street">Password</label>
        <input type="text" id="password" placeholder="Currently unavailable" />
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
        <button className={classes.button} type="button" onClick={closeCard}>
          Cancel
        </button>
        <button className={classes.button}>Log in</button>
      </div>
    </>
  );

  if (authError) {
    return (
      <Modal>
        <div className={classes.control}>
          <p> Opps, something went wrong!</p>
          <p> Please, check you API token</p>
        </div>
        <div className={classes.actions}>
          <button className={classes.button} type="button" onClick={closeCard}>
            Cancel
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal>
      <p>Please, fill in the form below</p>
      <form className={classes.form} onSubmit={confirmHandler}>
        {content}
      </form>
    </Modal>
  );
};

export default SignInPopup;
