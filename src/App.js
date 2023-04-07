import Header from "./components/header";
import BetsUsers from "./components/betsUsers";
import Main from "./components/Main/main";
import { useCrashContext } from "./components/Main/context";
import { useEffect } from "react";
import propeller from "./assets/images/propeller.png"
// import "./App.scss";

function App() {
  const [state] = useCrashContext();
  useEffect(() => {
    console.log(state.myUnitycontext);
    if (state.myUnitycontext) {
      console.log(state.myUnitycontext);
      state.myUnitycontext.on("progress", (progression) => {
        console.log(progression);
      })
    }
  }, [state.myUnitycontext])
  return (
    <div className="main-container">
      {!state.unityLoading &&
        <div className="myloading">
          <div className="loading-container">
            <div className="rotation">
              <img alt="propeller" src={propeller}></img>
            </div>
            <div className="waiting">
              <div style={{ width: `${state.currentProgress}%` }}></div>
            </div>
            <p>{Number(state.currentProgress).toFixed(2)}%</p>
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
