import { useState, useEffect } from 'react';
import SignInPopup from './components/main/sing-in-popup';
import Main from './components/main/main';
import Header from './components/layout/header';
import UserProvider from './store/user-provider';
import './App.css';
import { clientEvents } from "./emiter/client-events";

function App() {
  const [isCartShown, setIsCartShown] = useState(false);

  const CloseHandler = () => {
    setIsCartShown(false);
  };
  const OpenHandler = () => {
    setIsCartShown(true);
  };

  useEffect(() => {
    clientEvents.addListener("ECloseClicked", CloseHandler);
    clientEvents.addListener("EOpenClicked", OpenHandler);
    return () => {
      clientEvents.removeListener("ECloseClicked", CloseHandler);
      clientEvents.removeListener("EOpenClicked", OpenHandler);
    };
  }, []);

  return (
    <UserProvider>
    {isCartShown && <SignInPopup />}
      <Header />
      <Main />
    </UserProvider>
  );
}

export default App;
