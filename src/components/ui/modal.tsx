import ReactDOM from "react-dom";
import classes from "./modal.module.css";
import { clientEvents } from "../../emiter/client-events";

const Backdrop = () => {
  const closeCart = () => {
    clientEvents.emit("ECloseClicked");
  };

  return <div className={classes.backdrop} onClick={closeCart} />;
};

const ModalOverlay:React.FC<{children: React.ReactNode}> = (props) => {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById("overlays") as HTMLElement;

const Modal:React.FC<{children: React.ReactNode}> = (props) => {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop />, portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        portalElement
      )}
    </>
  );
};

export default Modal;
