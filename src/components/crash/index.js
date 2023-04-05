import { useEffect, useState } from "react";
import { useCrashContext } from "../Main/context";
import "./index.scss";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/Build/AirCrash.loader.js",
  dataUrl: "build/Build/AirCrash.data",
  frameworkUrl: "build/Build/AirCrash.framework.js",
  codeUrl: "build/Build/AirCrash.wasm"
});

// let maxAmount = 1 + 0.98 / (Math.random() + 0.00001);

export default function WebGLStarter() {
  const [state] = useCrashContext();
  const [target, setTarget] = useState(1);
  const [waiting, setWaiting] = useState();

  useEffect(() => {
    let myInterval;
    if (state.gameState.GameState === "PLAYING") {
      let startTime = Date.now() - state.gameState.time;
      let currentTime;
      let currentNum;
      const getCurrentTime = () => {
        currentTime = (Date.now() - startTime) / 1000;
        currentNum = 1 + 0.06 * currentTime + Math.pow((0.06 * currentTime), 2) - Math.pow((0.04 * currentTime), 3) + Math.pow((0.04 * currentTime), 4);
        setTarget(currentNum);
      }

      myInterval = setInterval(() => {
        getCurrentTime();
      }, 20);
    } else if (state.gameState.GameState === "GAMEEND") {
      setTarget(state.gameState.currentNum);
    } else if (state.gameState.GameState === "BET") {
      let startWaiting = Date.now() - state.gameState.time;
      setTarget(1);

      myInterval = setInterval(() => {
        setWaiting(Date.now() - startWaiting);
      }, 20);
    }

    return () => clearInterval(myInterval);
  }, [state.gameState.GameState])

  return (
    <div className="crash-container">
      <div className="canvas">
        <Unity
          unityContext={unityContext}
          matchWebGLToCanvasSize={true}
        />
      </div>
      {state.gameState.GameState === "BET" ? (
        <div className={`crashtext wait font-9`} >
          <div className="rotate">
            <svg fill="red" className="svg" version="1.1" id="Capa_1"
              viewBox="0 0 510.991 510.991" >
              <g>
                <path d="M255.19,312.694h-0.01c-4.142,0-7.495,3.358-7.495,7.5s3.363,7.5,7.505,7.5s7.5-3.358,7.5-7.5
		S259.332,312.694,255.19,312.694z"/>
                <path d="M500.676,441.447L309.241,330.922c-0.095-0.058-0.191-0.114-0.29-0.167l-14.297-8.255c0.044-0.764,0.073-1.532,0.073-2.307
		c0-19.285-13.875-35.381-32.165-38.853v-10.426l58.181-25.858c8.778-3.901,13.673-13.221,11.903-22.663
		c-0.024-0.131-0.053-0.262-0.084-0.393L288.443,40.805c-1.915-9.641-10.392-16.616-20.243-16.616
		c-11.38,0-20.638,9.258-20.638,20.638v221.051c-0.002,0.111-0.002,0.221,0,0.333v15.168c-18.183,3.558-31.948,19.605-31.948,38.814
		c0,5.173,1.009,10.113,2.822,14.646l-9.238,6.454l-54.52-32.884c-8.226-4.961-18.669-3.635-25.395,3.223
		c-0.094,0.095-0.185,0.193-0.273,0.293L5.745,451.868c-6.807,7.092-7.669,18.036-2.027,26.11c3.157,4.52,7.885,7.539,13.313,8.501
		c1.218,0.216,2.438,0.323,3.649,0.323c4.188,0,8.271-1.276,11.776-3.726l181.209-126.604c0.09-0.06,0.179-0.122,0.266-0.186
		l12.627-8.822c7.209,7.561,17.366,12.286,28.613,12.286c15.591,0,29.099-9.069,35.539-22.206l6.669,3.85l-6.697,63.315
		c-1.01,9.554,4.613,18.452,13.675,21.64c0.126,0.044,0.253,0.085,0.382,0.123l178.979,52.391c2.183,0.742,4.419,1.098,6.628,1.098
		c7.207,0,14.114-3.791,17.884-10.32C513.92,459.785,510.531,447.138,500.676,441.447z M262.562,44.827
		c0-3.109,2.529-5.638,5.638-5.638c2.711,0,5.042,1.934,5.542,4.599c0.025,0.132,0.053,0.263,0.084,0.393l44.104,181.135
		c0.401,2.525-0.93,4.99-3.279,6.034L262.562,254.5V44.827z M23.865,470.781c-1.235,0.862-2.732,1.191-4.214,0.93
		c-1.483-0.263-2.774-1.088-3.637-2.323c-1.553-2.223-1.302-5.241,0.596-7.177c0.094-0.095,0.185-0.193,0.273-0.293l123.225-139.895
		c1.84-1.776,4.623-2.097,6.825-0.768l48.81,29.44L23.865,470.781z M255.17,344.75c-13.541,0-24.556-11.016-24.556-24.556
		s11.016-24.556,24.556-24.556s24.556,11.016,24.556,24.556c0,0.877-0.048,1.742-0.138,2.595c-0.711,1.344-0.974,2.811-0.834,4.229
		C275.79,337.247,266.343,344.75,255.17,344.75z M495.24,462.139c-1.356,2.349-4.197,3.398-6.754,2.5
		c-0.126-0.044-0.253-0.085-0.382-0.123l-178.919-52.373c-2.387-0.915-3.856-3.3-3.586-5.857l5.996-56.686l181.581,104.836
		C495.868,455.992,496.794,459.447,495.24,462.139z"/>
              </g>
            </svg>
          </div>
          <div className="waiting-font">WAITING FOR NEXT ROUND</div>
          <div className="waiting">
            <div style={{ width: `${(5000 - waiting) * 100 / 5000}%` }}></div>
          </div>
        </div>
      ) : (
        <div className={`crashtext ${state.gameState.GameState === "GAMEEND" && "red"}`}>
          {state.gameState.GameState === "GAMEEND" && <div style={{ color: "white", fontSize: "40px", marginTop: "-47px" }}>FLEW AWAY!</div>}
          <div>
            {state.gameState.currentNum ? Number(target).toFixed(2) : "1.00"} <span className="font-[900]">x</span>
          </div>
        </div>
      )}
    </div>
  );
};

