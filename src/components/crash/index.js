import { useEffect, useState } from "react";
import { useCrashContext } from "../Main/context";
import "./index.scss";
import Unity from "react-unity-webgl";
import propeller from "../../assets/images/propeller.png"

let currentFlag = 0;
// let maxAmount = 1 + 0.98 / (Math.random() + 0.00001);

export default function WebGLStarter() {
  const [state] = useCrashContext();
  const [target, setTarget] = useState(1);
  const [waiting, setWaiting] = useState();
  const [flag, setFlag] = useState(1);

  useEffect(() => {
    let myInterval;
    if (state.gameState.GameState === "PLAYING") {
      setFlag(2);
      let startTime = Date.now() - state.gameState.time;
      let currentTime;
      let currentNum;
      const getCurrentTime = (e) => {
        currentTime = (Date.now() - startTime) / 1000;
        currentNum = 1 + 0.06 * currentTime + Math.pow((0.06 * currentTime), 2) - Math.pow((0.04 * currentTime), 3) + Math.pow((0.04 * currentTime), 4);
        if (currentNum > 2 && e === 2) {
          setFlag(3);
        } else if (currentNum > 10 && e === 3) {
          setFlag(4);
        }
        setTarget(currentNum);
      }
      myInterval = setInterval(() => {
        getCurrentTime(currentFlag);
      }, 20);
    } else if (state.gameState.GameState === "GAMEEND") {
      setFlag(5);
      setTarget(state.gameState.currentNum);
    } else if (state.gameState.GameState === "BET") {
      setFlag(1);
      let startWaiting = Date.now() - state.gameState.time;
      setTarget(1);

      myInterval = setInterval(() => {
        setWaiting(Date.now() - startWaiting);
      }, 20);
    }
    return () => clearInterval(myInterval);
  }, [state.gameState.GameState, state.unityState])

  useEffect(() => {
    state.myUnityContext?.send("GameManager", "RequestToken", JSON.stringify({
      gameState: flag
    }));
    currentFlag = flag;
  }, [flag, state.myUnityContext]);

  return (
    <div className="crash-container">
      <div className="canvas">
        <Unity
          unityContext={state.myUnityContext ? state.myUnityContext : ""}
          matchWebGLToCanvasSize={true}
        />
      </div>
      <div className="crash-text-container">
        {state.gameState.GameState === "BET" ? (
          <div className={`crashtext wait font-9`} >
            <div className="rotate">
              <img width={100} height={100} src={propeller} alt="propellar"></img>
            </div>
            <div className="waiting-font">WAITING FOR NEXT ROUND</div>
            <div className="waiting">
              <div style={{ width: `${(5000 - waiting) * 100 / 5000}%` }}></div>
            </div>
          </div>
        ) : (
          <div className={`crashtext ${state.gameState.GameState === "GAMEEND" && "red"}`}>
            {state.gameState.GameState === "GAMEEND" && <div className="flew-away">FLEW AWAY!</div>}
            <div>
              {state.gameState.currentNum ? Number(target).toFixed(2) : "1.00"} <span className="font-[900]">x</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

