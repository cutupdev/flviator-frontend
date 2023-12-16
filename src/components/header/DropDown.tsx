import React, { useEffect, useState } from "react";
import {
  HiSpeakerWave,
  HiOutlineMusicalNote,
  HiOutlineShieldCheck,
  HiDocumentText,
} from "react-icons/hi2";
import { MdHistory } from "react-icons/md";
import { CiMoneyBill } from "react-icons/ci";

const DropDown = ({
  audioStatus,
  setAudioStatus,
  cities,
  citySelection,
}): JSX.Element => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  /**
   * Handle passing the city name
   * back to the parent component
   *
   * @param city  The selected city
   */
  const onClickHandler = (city: string): void => {
    citySelection(city);
  };

  useEffect(() => {
    setShowDropDown(showDropDown);
  }, [showDropDown]);

  const handleToggleMainAudio = async (e) => {
    let mainEle: any = document.getElementById("mainAudio");
    if (e.target.checked === true) {
      mainEle.muted = false;
      mainEle.play();
    } else {
      mainEle.muted = true;
      mainEle.pause();
    }
    setAudioStatus({
      ...audioStatus,
      soundStatus: e.target.checked,
    });
  };

  const handleToggleMusicAudio = async (e) => {
    let takeOffAudioEle: any = document.getElementById("takeOffAudio");
    let flewAwayAudioEle: any = document.getElementById("flewAwayAudio");
    if (e.target.checked === true) {
      takeOffAudioEle.muted = false;
      takeOffAudioEle.playbackRate = 10;
      takeOffAudioEle.play();
      setTimeout(() => {
        takeOffAudioEle.playbackRate = 1;
        takeOffAudioEle.muted = false;
      }, 200);
      flewAwayAudioEle.muted = false;
      flewAwayAudioEle.playbackRate = 10;
      flewAwayAudioEle.play();
      setTimeout(() => {
        flewAwayAudioEle.playbackRate = 1;
        flewAwayAudioEle.muted = false;
      }, 200);
    } else {
      takeOffAudioEle.muted = true;
      takeOffAudioEle.pause();
      flewAwayAudioEle.muted = true;
      flewAwayAudioEle.pause();
    }
    setAudioStatus({
      ...audioStatus,
      musicStatus: e.target.checked,
    });
  };

  return (
    <div
      className={showDropDown ? "setting-dropdown" : "setting-dropdown active"}
    >
      <div className="setting-dropdown-item">
        <div className="icon-section">
          <HiSpeakerWave color="#fff" size={20} />
          <span className="setting-title-text">Sound</span>
        </div>
        <div className="aviator-main-audio">
          <label className="aviator-switch">
            <input
              className="aviator-input"
              type="checkbox"
              onChange={(e) => handleToggleMainAudio(e)}
            />
            <span className="aviator-slider round"></span>
          </label>
        </div>
      </div>
      <div className="setting-dropdown-item pb-20">
        <div className="icon-section">
          <HiOutlineMusicalNote color="#fff" size={20} />
          <span className="setting-title-text">Music</span>
        </div>
        <div className="aviator-main-audio">
          <label className="aviator-switch">
            <input
              className="aviator-input"
              type="checkbox"
              onChange={(e) => handleToggleMusicAudio(e)}
            />
            <span className="aviator-slider round"></span>
          </label>
        </div>
      </div>

      <div className="setting-dropdown-item">
        <div className="icon-section">
          <HiOutlineShieldCheck color="#fff" size={20} />
          <span className="setting-title-text">Provably Fair Settings</span>
        </div>
      </div>
      <div className="setting-dropdown-item">
        <div className="icon-section">
          <HiDocumentText color="#fff" size={20} />
          <span className="setting-title-text">Game Rules</span>
        </div>
      </div>
      <div className="setting-dropdown-item">
        <div className="icon-section">
          <MdHistory color="#fff" size={20} />
          <span className="setting-title-text">My Bet History</span>
        </div>
      </div>
      <div className="setting-dropdown-item">
        <div className="icon-section">
          <CiMoneyBill color="#fff" size={20} />
          <span className="setting-title-text">Game Limits</span>
        </div>
      </div>
    </div>
  );
};

export default DropDown;
