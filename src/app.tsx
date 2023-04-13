import React from "react";
import Header from "./components/header";
import BetsUsers from "./components/bet-users";
import Main from "./components/main";
// import { useCrashContext } from "./components/Main/context";
import propeller from "./assets/images/propeller.png"

import Context from "./context";
// import "./App.scss";

function App() {
  const {unityLoading, currentProgress} = React.useContext(Context)
  // const [state] = useCrashContext();
  return (
    <div className="main-container">
      {!unityLoading &&
        <div className="myloading">
          <div className="loading-container">
            <div className="rotation">
              <img alt="propeller" src={propeller}></img>
            </div>
            <div className="waiting">
              <div className="width-transition" style={{ width: `${currentProgress * 1.111}%` }}></div>
            </div>
            <p>{Number(currentProgress * 1.111 + 0.01).toFixed(2)}%</p>
          </div>
        </div>
      }
      <Header />
      <div className="game-container">
        <BetsUsers />
        <Main />
      </div>
    </div>
  );
}

export default App;
