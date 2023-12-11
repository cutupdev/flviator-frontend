import React from "react";
import { useLocation } from "react-router";
import Header from "./components/header";
import BetsUsers from "./components/bet-users";
import Main from "./components/Main";
// import { useCrashContext } from "./components/Main/context";
import propeller from "./assets/images/propeller.png";

import Context from "./context";
// import "./App.scss";

function App() {
  const {
    platformLoading,
    errorBackend,
    unityLoading,
    currentProgress,
    rechargeState,
  } = React.useContext(Context);
  const return_url = new URLSearchParams(useLocation().search).get(
    "return_url"
  );
  return (
    <div className="main-container">
      {platformLoading && (
        <div className="platformmyloading">
          <div className="loading-container">
            <div className="rotation">
              <img alt="propeller" src={propeller}></img>
            </div>
            {errorBackend === true ? (
              <div className="waiting-font">{return_url}</div>
            ) : (
              <div className="waiting-font">WAITING FOR LOADING IN BACKEND</div>
            )}
          </div>
        </div>
      )}
      {!platformLoading && !unityLoading && (
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
