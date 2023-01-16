import { useState, useEffect } from 'react';
import SignInPopup from './components/main/sing-in-popup';
import Main from './components/main';
import Header from './components/layout/header';
import './App.css';
import { clientEvents } from "./emiter/client-events";

function App() {
  const [isCartShown, setIsCartShown] = useState(false);

  const toggleCartHandler = () => {
    setIsCartShown((prev) => !prev);
  };

  useEffect(() => {
    clientEvents.addListener("ECartClicked", toggleCartHandler);
    return () => {
      clientEvents.removeListener("ECartClicked", toggleCartHandler);
    };
  }, []);

  return (
    <>
    {isCartShown && <SignInPopup />}
      <Header />
      <Main />
    </>
  );
}

export default App;
