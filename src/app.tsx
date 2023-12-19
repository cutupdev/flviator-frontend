import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import Header from "./components/header";
import BetsUsers from "./components/bet-users";
import Main from "./components/Main";
// import { useCrashContext } from "./components/Main/context";

import MainAudio from "./assets/audio/main.wav";
import FlewAwayAudio from "./assets/audio/flew_away.mp3";
import TakeOffAudio from "./assets/audio/take_off.mp3";

import propeller from "./assets/images/propeller.png";

import Context from "./context";
import CustomToastContainer from "./components/Toast";
// import "./App.scss";

function App() {
  const {
    state,
    platformLoading,
    errorBackend,
    unityLoading,
    currentProgress,
    unityState,
    GameState,
  } = React.useContext(Context);
  const return_url = new URLSearchParams(useLocation().search).get(
    "return_url"
  );
  const [audioStatus, setAudioStatus] = useState({
    soundStatus: state.userInfo.soundStatus || false,
    musicStatus: state.userInfo.musicStatus || false,
  });

  const mainAudioRef = useRef<HTMLAudioElement>(new Audio(MainAudio) || null);
  const takeOffAudioRef = useRef<HTMLAudioElement>(
    new Audio(FlewAwayAudio) || null
  );
  const flewAwayAudioRef = useRef<HTMLAudioElement>(
    new Audio(TakeOffAudio) || null
  );

  useEffect(() => {
    if (
      GameState === "PLAYING" &&
      unityState === true &&
      state.userInfo.soundStatus === true
    ) {
      if (takeOffAudioRef.current) takeOffAudioRef.current.play();
    }
    // eslint-disable-next-line
  }, [takeOffAudioRef, GameState, state.userInfo.soundStatus]);

  useEffect(() => {
    if (
      GameState === "GAMEEND" &&
      unityState === true &&
      state.userInfo.soundStatus === true
    ) {
      if (flewAwayAudioRef.current) flewAwayAudioRef.current.play();
    }
    // eslint-disable-next-line
  }, [flewAwayAudioRef.current, GameState, state.userInfo.soundStatus]);

  return (
    <div className="main-container">
      <div style={{ display: "none" }}>
        {/* Main Audio Section */}
        <audio id="mainAudio" ref={mainAudioRef} loop>
          <source src={MainAudio} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>

        {/* Take Off Audio Section */}
        <audio id="takeOffAudio" ref={takeOffAudioRef}>
          <source src={TakeOffAudio} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>

        {/* Flew Away Audio Section */}
        <audio id="flewAwayAudio" ref={flewAwayAudioRef}>
          <source src={FlewAwayAudio} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      </div>

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
