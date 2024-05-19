import React, { useState } from "react";
import Login from "./pages/Login";
import "./App.css";
import Chat from "pages/Chat/Chat";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      {isLoggedIn ? (
        <Chat onLogOut={() => setIsLoggedIn(false)} />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </>
  );
};

export default App;
