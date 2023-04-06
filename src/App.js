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
    console.log(state.myUnityContext.isLoading);
  }, [state.myUnityContext])
  return (
    <div className="main-container">
      {state.myUnityContext?.isLoading ?
        <div className="myloading">
          <div className="loading-container">
            <div className="rotation">
              <img alt="propeller" src={propeller}></img>
            </div>
            <p>Loading ....</p>
          </div>
        </div> :
        <>
          <Header />
          <div className="game-container">
            <BetsUsers />
            <Main />
          </div>
        </>
      }
    </div>
  );
}

export default App;
