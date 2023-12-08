import React from "react";
import Header from "./components/header";
import BetsUsers from "./components/bet-users";
import Main from "./components/Main";
import propeller from "./assets/images/propeller.png";

import Context from "./context";

function App() {
  const { unityLoading, currentProgress } = React.useContext(Context);
  
  const randomString = (length) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let random = "";
    for (let i = 0; i < length; i++) {
      random += chars[Math.floor(Math.random() * chars.length)];
    }
    return random;
  };

  return (
    <div className="main-container">
      {!unityLoading && (
        <div className="myloading">
          <div className="loading-container">
            <div className="rotation">
              <img alt="propeller" src={propeller}></img>
            </div>
            <div className="waiting">
              <div
                style={{ width: `${currentProgress * 1.111 + 0.01}%` }}
              ></div>
            </div>
            <p>{Number(currentProgress * 1.111 + 0.01).toFixed(2)}%</p>
          </div>
        </div>
      )}
      <Header />
      <div className="game-container">
        <BetsUsers />
        <Main />
      </div>
    </div>
  );
}

export default App;
