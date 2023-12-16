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
// import "./App.scss";

function App() {
  const {
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
    soundStatus: false,
    musicStatus: false,
  });

  const takeOffBtnRef = useRef<HTMLButtonElement>(null);
  const flewAwayBtnRef = useRef<HTMLButtonElement>(null);

  const mainAudioRef = useRef<HTMLAudioElement>(null);
  const takeOffAudioRef = useRef<HTMLAudioElement>(null);
  const flewAwayAudioRef = useRef<HTMLAudioElement>(null);

  const playAudio = async (type: string) => {
    var audioRef: any;
    if (type === "main") audioRef = mainAudioRef;
    if (type === "take_off") audioRef = takeOffAudioRef;
    if (type === "flew_away") audioRef = flewAwayAudioRef;

    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  useEffect(() => {
    if (
      GameState === "PLAYING" &&
      unityState === true &&
      takeOffAudioRef.current &&
      audioStatus.musicStatus === true
    ) {
      if (takeOffBtnRef.current) takeOffBtnRef.current.click();
    }
    // eslint-disable-next-line
  }, [takeOffAudioRef, GameState]);

  useEffect(() => {
    if (
      GameState === "GAMEEND" &&
      unityState === true &&
      flewAwayAudioRef.current &&
      audioStatus.musicStatus === true
    ) {
      if (flewAwayBtnRef.current) flewAwayBtnRef.current.click();
    }
    // eslint-disable-next-line
  }, [flewAwayAudioRef.current, GameState]);

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
      <Header audioStatus={audioStatus} setAudioStatus={setAudioStatus} />
      <div className="game-container">
        <BetsUsers />
        <Main />
      </div>

      <div style={{ display: "none" }}>
        {/* Main Audio Section */}
        <audio id="mainAudio" ref={mainAudioRef} controls autoPlay loop>
          <source src={MainAudio} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>

        {/* Take Off Audio Section */}
        <button ref={takeOffBtnRef} onClick={() => playAudio("take_off")}>
          play take off
        </button>
        <audio id="takeOffAudio" ref={takeOffAudioRef} controls autoPlay>
          <source src={TakeOffAudio} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>

        {/* Flew Away Audio Section */}
        <button ref={flewAwayBtnRef} onClick={() => playAudio("flew_away")}>
          play flew away
        </button>
        <audio id="flewAwayAudio" ref={flewAwayAudioRef} controls autoPlay>
          <source src={FlewAwayAudio} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}

export default App;
