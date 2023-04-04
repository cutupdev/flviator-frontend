import { useCrashContext } from "../Main/context";
// import { createRef, useEffect, useState } from "react";
import "./index.scss";
// import bgGif from "../../assets/images/bg-image.gif"

// let maxAmount = 1 + 0.98 / (Math.random() + 0.00001);

export default function WebGLStarter() {
  const [state] = useCrashContext();

  return (
    <div className="crash-container">
      <div className="canvas">
        <canvas id="myCanvas" width={200} height={200}></canvas>
      </div>
      {state.gameState.GameState === "BET" ? (
        <div className={`crashtext font-9`} >
          <div>WAITING FOR NEXT ROUND</div>
          <div className="waiting">
            <div style={{ width: `${(5000 - state.gameState.time) * 100 / 5000}%` }}></div>
          </div>
        </div>
      ) : (
        <div className={`crashtext ${state.gameState.GameState === "GAMEEND" && "red"}`}>
          {state.gameState.GameState === "GAMEEND" && <div style={{ color: "white", fontSize: "40px", marginTop: "-47px" }}>FLEW AWAY!</div>}
          <div>
            {state.gameState.currentNum ? Number(state.gameState.currentNum).toFixed(2) : "1.00"} <span className="font-[900]">x</span>
          </div>
        </div>
      )}
    </div>
  );
};

