import React, { useEffect } from "react";
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
    mainAudio,
    flewAway,
    TakeOff,
  } = React.useContext(Context);
  const return_url = new URLSearchParams(useLocation().search).get(
    "return_url"
  );

  const audioCallingFunc = (docuID: string) => {
    let AudioPlayer: HTMLVideoElement = window.document?.querySelector(
      `${docuID}`
    )!;
    AudioPlayer.play();
    // AudioPlayer.onended = function () {
    //   alert("The audio has ended");
    // };
  };

  useEffect(() => {
    if (mainAudio === true) audioCallingFunc("#main");
  }, [mainAudio]);

  useEffect(() => {
    if (flewAway === true) audioCallingFunc("#flew_away");
  }, [flewAway]);

  useEffect(() => {
    if (TakeOff === true) audioCallingFunc("#take_off");
  }, [TakeOff]);

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

      <audio id="main" controls autoPlay loop>
        <source src={MainAudio} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
      <audio id="flew_away" controls autoPlay>
        <source src={FlewAwayAudio} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <audio id="take_off" controls autoPlay>
        <source src={TakeOffAudio} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default App;
