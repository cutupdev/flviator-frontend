import React from "react";
import Header from "./components/header";
import BetsUsers from "./components/bet-users";
import Main from "./components/Main";
// import { useCrashContext } from "./components/Main/context";
import propeller from "./assets/images/propeller.png"

import Context from "./context";
// import "./App.scss";

function App() {
  const { unityLoading, currentProgress, rechargeState } = React.useContext(Context)
  // console.log('unityLoading, currentProgress', unityLoading, currentProgress)
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
              <div className="width-transition" style={{ width: `${currentProgress * 1.111 + 0.01}%` }}></div>
            </div>
            <p>{Number(currentProgress * 1.111 + 0.01).toFixed(2)}%</p>
          </div>
        </div>
      }
      {rechargeState && 
      <div className="recharge">
        <div className="recharge-body">
          <div className="recharge-body-font">Insufficient balance amount</div>
          <a href="http://annie.ihk.vipnps.vip/iGaming-web/#/pages/recharge/recharge">annie.ihk.vipnps.vip/iGaming-web/#/pages/recharge/recharge</a>
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
